import React, { useState, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import {
    selectCurrentUniversityExam,
    attemptUniversityExam,
    selectUniversityExamsAttemptLoading,
} from '../redux/slices/universityExamsSlice';
import { showNotification } from '../redux/slices/uiSlice';

const UniversityExamTakingPage = () => {
    const { examId } = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();

    const courseId = location.state?.courseId;
    const examName = location.state?.examName || 'University Exam';

    const examData = useSelector(selectCurrentUniversityExam);
    const loading = useSelector(selectUniversityExamsAttemptLoading);

    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [answers, setAnswers] = useState({}); // Format: { "question_id": "a" }

    // Timer State
    const initialDuration = examData?.duration_minutes ? examData.duration_minutes * 60 : 3600; // Default 1 hour
    const [timeLeft, setTimeLeft] = useState(initialDuration);
    const [examSubmitted, setExamSubmitted] = useState(false);

    // Questions array
    const questions = examData?.questions || [];

    // --- Timer Logic ---
    const handleAutoSubmit = useCallback(async () => {
        if (examSubmitted) return;
        setExamSubmitted(true);

        try {
            // API expects: { exam_id: "uuid", answers: { "q_id": "a" } }
            await dispatch(attemptUniversityExam({
                exam_id: examId,
                answers: answers
            })).unwrap();

            dispatch(showNotification({ type: 'success', message: 'Time is up! Exam submitted successfully.' }));
            navigate(`/university-exams/${examId}/result`, { state: { courseId }, replace: true });
        } catch (error) {
            dispatch(showNotification({ type: 'error', message: error || 'Failed to submit exam.' }));
            // Depending on requirements, we might still want to navigate away or let them retry submission
            navigate(`/university-exams/${examId}/result`, { state: { courseId }, replace: true });
        }
    }, [examSubmitted, answers, dispatch, examId, navigate, courseId]);

    useEffect(() => {
        if (questions.length === 0) return; // Don't start timer if no questions

        const timer = setInterval(() => {
            setTimeLeft(prev => {
                if (prev <= 1) {
                    clearInterval(timer);
                    handleAutoSubmit();
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [handleAutoSubmit, questions.length]);

    // Prevent accidental navigation
    useEffect(() => {
        const handleBeforeUnload = (e) => {
            e.preventDefault();
            e.returnValue = '';
        };
        window.addEventListener('beforeunload', handleBeforeUnload);
        return () => window.removeEventListener('beforeunload', handleBeforeUnload);
    }, []);

    // Format time (MM:SS)
    const formatTime = (seconds) => {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    };

    // --- Exam Interaction Logic ---
    const handleOptionSelect = (questionId, optionKey) => {
        setAnswers(prev => ({
            ...prev,
            [questionId]: optionKey
        }));
    };

    const currentQuestion = questions[currentQuestionIndex];

    const handleNext = () => {
        if (currentQuestionIndex < questions.length - 1) {
            setCurrentQuestionIndex(prev => prev + 1);
        }
    };

    const handlePrevious = () => {
        if (currentQuestionIndex > 0) {
            setCurrentQuestionIndex(prev => prev - 1);
        }
    };

    const handleSubmit = async () => {
        if (window.confirm('Are you sure you want to submit your exam now? You cannot change your answers after submission.')) {
            if (examSubmitted) return;
            setExamSubmitted(true);

            try {
                const result = await dispatch(attemptUniversityExam({
                    exam_id: examId,
                    answers: answers
                })).unwrap();

                dispatch(showNotification({ type: 'success', message: 'Exam submitted successfully!' }));
                // Ensure result isn't blocking if "already attempted" message is returned in success block
                navigate(`/university-exams/${examId}/result`, { state: { courseId }, replace: true });
            } catch (error) {
                setExamSubmitted(false); // Allow retry on failure
                dispatch(showNotification({ type: 'error', message: error || 'Failed to submit exam. Please try again.' }));
            }
        }
    };

    // Calculate answered count
    const answeredCount = Object.keys(answers).length;
    const isTimeWarning = timeLeft < 300; // Less than 5 minutes

    if (!examData || questions.length === 0) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 pt-32 pb-20">
                <div className="bg-white p-8 rounded-2xl shadow-md text-center">
                    <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Exam Data Unavailable</h2>
                    <p className="text-gray-500 mb-6">Could not load the questions for this exam. Please go back and try again.</p>
                    <button
                        onClick={() => navigate(-1)}
                        className="px-6 py-2 bg-orange-600 text-white font-bold rounded-lg hover:bg-orange-700 transition"
                    >
                        Go Back
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col font-sans selection:bg-orange-100 selection:text-orange-900 pt-20">

            {/* Top Header / Status Bar */}
            <header className="bg-white border-b border-gray-200 sticky top-20 z-40 shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">

                    <div className="flex items-center gap-4">
                        <div className="hidden md:flex flex-col">
                            <span className="text-xs font-bold text-gray-500 uppercase tracking-widest leading-tight">University Exam</span>
                            <h1 className="text-lg font-bold text-gray-900 leading-tight truncate max-w-[300px] lg:max-w-md">{examName}</h1>
                        </div>
                    </div>

                    <div className="flex items-center gap-6">
                        <div className="text-center hidden sm:block">
                            <span className="block text-xs font-bold text-gray-500 uppercase">Progress</span>
                            <span className="text-sm font-bold text-gray-900">
                                <span className="text-orange-600">{answeredCount}</span> / {questions.length} Answered
                            </span>
                        </div>

                        <div className={`flex items-center gap-2 px-4 py-1.5 rounded-full font-bold border transition-colors ${isTimeWarning
                            ? 'bg-red-50 text-red-600 border-red-200 animate-pulse'
                            : 'bg-orange-50 text-orange-700 border-orange-100'
                            }`}>
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span className="text-lg tracking-wider font-mono">{formatTime(timeLeft)}</span>
                        </div>

                        <button
                            onClick={handleSubmit}
                            disabled={loading || examSubmitted}
                            className="px-5 py-2 bg-linear-to-r from-orange-600 to-orange-600 text-white font-bold rounded-lg hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? 'Submitting...' : 'Finish Exam'}
                        </button>
                    </div>
                </div>

                {/* Progress Bar under header */}
                <div className="w-full h-1.5 bg-gray-100">
                    <div
                        className="h-full bg-linear-to-r from-orange-500 to-orange-500 transition-all duration-300 ease-out"
                        style={{ width: `${(answeredCount / questions.length) * 100}%` }}
                    ></div>
                </div>
            </header>

            {/* Main Content Area */}
            <main className="flex-grow flex w-full max-w-7xl mx-auto overflow-hidden">

                {/* Question Panel */}
                <div className="flex-grow flex flex-col p-4 sm:p-6 lg:p-8 overflow-y-auto">

                    <div className="flex items-center justify-between mb-8">
                        <span className="text-sm font-bold text-gray-400 tracking-widest uppercase">
                            Question {currentQuestionIndex + 1} of {questions.length}
                        </span>
                        <span className="bg-orange-50 text-orange-600 px-3 py-1 rounded-md text-xs font-bold border border-orange-100">
                            {currentQuestion?.marks || 1} Mark{(currentQuestion?.marks > 1) ? 's' : ''}
                        </span>
                    </div>

                    <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 md:p-10 mb-8">
                        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 leading-tight mb-10 whitespace-pre-line">
                            {currentQuestion?.question}
                        </h2>

                        {/* Options Grid */}
                        <div className="grid grid-cols-1 gap-4">
                            {['a', 'b', 'c', 'd', 'e', 'f'].map((optionLabel) => {
                                const optionText = currentQuestion?.[`option_${optionLabel}`];
                                if (!optionText) return null; // Skip empty options

                                const isSelected = answers[currentQuestion.id] === optionLabel;

                                return (
                                    <div
                                        key={optionLabel}
                                        onClick={() => handleOptionSelect(currentQuestion.id, optionLabel)}
                                        className={`flex items-start p-4 md:p-5 rounded-2xl border-2 cursor-pointer transition-all duration-200 group ${isSelected
                                            ? 'border-orange-600 bg-orange-50 shadow-md shadow-orange-100/50 scale-[1.01]'
                                            : 'border-gray-200 hover:border-orange-300 hover:bg-gray-50'
                                            }`}
                                    >
                                        <div className={`flex-shrink-0 w-8 h-8 rounded-full border-2 flex items-center justify-center mr-4 mt-0.5 font-bold text-sm transition-colors ${isSelected
                                            ? 'bg-orange-600 border-orange-600 text-white'
                                            : 'border-gray-300 text-gray-500 group-hover:border-orange-400 group-hover:text-orange-500 bg-white'
                                            }`}>
                                            {optionLabel.toUpperCase()}
                                        </div>
                                        <span className={`text-lg transition-colors ${isSelected ? 'text-orange-900 font-medium' : 'text-gray-700'}`}>
                                            {optionText}
                                        </span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Navigation Controls */}
                    <div className="flex items-center justify-between mt-auto">
                        <button
                            onClick={handlePrevious}
                            disabled={currentQuestionIndex === 0}
                            className={`flex items-center px-6 py-3 rounded-xl font-bold transition-colors ${currentQuestionIndex === 0
                                ? 'text-gray-400 bg-gray-100 cursor-not-allowed'
                                : 'text-orange-600 bg-orange-50 hover:bg-orange-100'
                                }`}
                        >
                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                            Previous
                        </button>

                        {currentQuestionIndex === questions.length - 1 ? (
                            <button
                                onClick={handleSubmit}
                                disabled={loading || examSubmitted}
                                className="flex items-center px-8 py-3 rounded-xl font-bold transition-all text-white bg-green-600 hover:bg-green-700 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading ? 'Submitting...' : 'Submit Exam'}
                                <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                            </button>
                        ) : (
                            <button
                                onClick={handleNext}
                                disabled={currentQuestionIndex === questions.length - 1}
                                className="flex items-center px-8 py-3 rounded-xl font-bold transition-all text-white bg-gray-900 hover:bg-black shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Next
                                <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                            </button>
                        )}
                    </div>
                </div>

                {/* Sidebar / Question Navigator */}
                <div className="hidden lg:block w-80 border-l border-gray-200 bg-white p-6 overflow-y-auto">
                    <h3 className="font-bold text-gray-900 mb-6 flex items-center gap-2">
                        <svg className="w-5 h-5 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>
                        Question Navigator
                    </h3>

                    <div className="grid grid-cols-4 gap-3">
                        {questions.map((q, idx) => {
                            const isAnswered = !!answers[q.id];
                            const isCurrent = idx === currentQuestionIndex;

                            return (
                                <button
                                    key={q.id}
                                    onClick={() => setCurrentQuestionIndex(idx)}
                                    className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold text-sm transition-all ${isCurrent
                                        ? 'ring-2 ring-orange-600 ring-offset-2 bg-orange-600 text-white'
                                        : isAnswered
                                            ? 'bg-orange-100 text-orange-700 border-2 border-orange-200'
                                            : 'bg-gray-50 text-gray-500 border border-gray-200 hover:border-gray-400'
                                        }`}
                                >
                                    {idx + 1}
                                </button>
                            );
                        })}
                    </div>

                    <div className="mt-8 pt-6 border-t border-gray-100">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="w-4 h-4 rounded bg-orange-100 border border-orange-200"></div>
                            <span className="text-sm text-gray-600">Answered</span>
                        </div>
                        <div className="flex items-center gap-3 mb-3">
                            <div className="w-4 h-4 rounded bg-gray-50 border border-gray-200"></div>
                            <span className="text-sm text-gray-600">Unanswered</span>
                        </div>
                        <div className="flex items-center gap-3 mb-3">
                            <div className="w-4 h-4 rounded bg-orange-600 ring-1 ring-orange-600 ring-offset-1"></div>
                            <span className="text-sm text-gray-600">Current</span>
                        </div>
                    </div>
                </div>

            </main>
        </div>
    );
};

export default UniversityExamTakingPage;
