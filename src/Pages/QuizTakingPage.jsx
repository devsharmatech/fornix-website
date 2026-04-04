import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import {
    submitQuiz,
    submitSubjectQuiz,
    fetchAttemptDetails,
    selectCurrentQuiz,
    selectQuizLoading,
    selectQuizError,
} from '../redux/slices/quizSlice';
import { selectUser } from '../redux/slices/authSlice';
import { selectUserProfile, fetchUserDetails } from '../redux/slices/userSlice';
import { selectCurrentMockTest, submitMockTest } from '../redux/slices/mockTestsSlice';
import { showNotification } from '../redux/slices/uiSlice';
import API from '../api/api';

function QuizTakingPage() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    const { quizId } = useParams();
    const user = useSelector(selectUser);
    const userProfile = useSelector(selectUserProfile);

    // Use profile if available, otherwise fall back to auth user
    const activeUser = userProfile || user;

    // Fetch full user profile if we only have basic auth info
    useEffect(() => {
        if (user?.user_id && !userProfile) {
            dispatch(fetchUserDetails(user.user_id));
        } else if (user?.id && !userProfile) {
            dispatch(fetchUserDetails(user.id));
        }
    }, [dispatch, user, userProfile]);

    const currentQuiz = useSelector(selectCurrentQuiz);
    const currentMockTest = useSelector(selectCurrentMockTest);
    const loading = useSelector(selectQuizLoading);
    const error = useSelector(selectQuizError);

    // Use currentMockTest if available (has higher priority), otherwise use currentQuiz
    const quiz = currentMockTest || currentQuiz;

    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [answers, setAnswers] = useState({});
    const [timeRemaining, setTimeRemaining] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isShowSubmitModal, setIsShowSubmitModal] = useState(false);
    const [highlightedQuestions, setHighlightedQuestions] = useState({});

    const isMockTest = location.state?.isMockTest;
    const mockTestId = location.state?.testId;

    

    // Fetch quiz details when page loads (only if not already loaded)
    useEffect(() => {
        // If quiz is already loaded with questions, don't fetch again
        if (quiz?.questions?.length > 0) {
            return;
        }

        // If it's a mock test, we rely on currentMockTest from Redux (set by startMockTest)
        // OR we might need to re-fetch if page refreshed (implement mock test details fetch if needed)
        if (isMockTest) {
            if (!currentMockTest && mockTestId && (user?.user_id || user?.id)) {
                // Optionally: dispatch(startMockTest(mockTestId)) to reload if needed, 
                // but for now let's assume it should have been set. 
                // If not set, user might need to go back.
            }
            return;
        }

        // Only fetch if we have a real attempt ID (not 'direct') and NOT a mock test
        if (quizId && quizId !== 'direct' && (user?.user_id || user?.id)) {
            dispatch(fetchAttemptDetails({
                user_id: user?.user_id || user?.id,
                attempt_id: quizId
            }));
        }
    }, [dispatch, quizId, user, quiz, isMockTest, currentMockTest, mockTestId]);

    // Initialize timer
    useEffect(() => {
        if (quiz?.duration) {
            setTimeRemaining(quiz.duration * 60); // Convert minutes to seconds
        }
    }, [quiz]);

    // Timer countdown
    useEffect(() => {
        if (timeRemaining === null || timeRemaining <= 0) return;

        const timer = setInterval(() => {
            setTimeRemaining(prev => {
                if (prev <= 1) {
                    handleSubmitQuiz();
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [timeRemaining]);

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const handleAnswerSelect = (questionId, optionIndex) => {
        setAnswers(prev => ({
            ...prev,
            [questionId]: optionIndex
        }));
    };

    // Global delegated click handler to remove highlights robustly even after React re-renders
    const handleContainerClick = (e) => {
        if (e.target && e.target.tagName === 'MARK') {
            const mark = e.target;
            const parent = mark.parentNode;
            while (mark.firstChild) {
                parent.insertBefore(mark.firstChild, mark);
            }
            parent.removeChild(mark);
            
            const container = document.getElementById(`question-text-${currentQuestion?.id}`);
            if (container) {
                setHighlightedQuestions(prev => ({
                    ...prev,
                    [currentQuestion.id]: container.innerHTML
                }));
            }
        }
    };

    // Native text highlighter for question stems
    const handleHighlight = () => {
        const selection = window.getSelection();
        if (!selection || !selection.rangeCount || selection.isCollapsed) return;

        const range = selection.getRangeAt(0);
        const container = document.getElementById(`question-text-${currentQuestion?.id}`);
        
        // Ensure the selection is strictly within the question block
        if (container && container.contains(range.commonAncestorContainer)) {
            try {
                // Extract plain text to make sure we aren't just highlighting empty space
                if (!range.toString().trim()) {
                    selection.removeAllRanges();
                    return;
                }

                const mark = document.createElement('mark');
                mark.className = 'bg-yellow-300 text-gray-900 font-medium px-0.5 rounded cursor-pointer shadow-[0_2px_10px_rgba(253,224,71,0.3)] transition-all';
                mark.title = "Click to remove highlight";
                
                range.surroundContents(mark);
                
                // Save mutated DOM to state so it persists if the component re-renders
                setHighlightedQuestions(prev => ({
                    ...prev,
                    [currentQuestion.id]: container.innerHTML
                }));
                
                selection.removeAllRanges();
            } catch (e) {
                // Catch cases where selection straddles complex node boundaries
                selection.removeAllRanges();
            }
        }
    };

    const handlesubmitMockTest = async () => {


        const optionKeys = ['a', 'b', 'c', 'd', 'e'];
        setIsSubmitting(true);
        const payload = {
            user_id: user?.user_id || user?.id,

            time_taken_seconds: timeRemaining,
            answers: quiz?.questions?.map(q => ({
                question_id: q.id,
                selected_option: answers[q.id] !== undefined ? optionKeys[answers[q.id]] : null,
                selected_key: answers[q.id] !== undefined ? optionKeys[answers[q.id]] : null
            })) || []
        };

        
        const response = await API.post(`/mobile/mock-tests/${mockTestId}/submit`, payload)


        
        

        if (response.data.success) {

            dispatch(showNotification({
                type: 'success',
                message: 'Test submitted successfully!'
            }));

            localStorage.setItem('quiz_results_direct', JSON.stringify(response.data.result));

            setIsSubmitting(false);

            // Navigate to results page
            // Use test_id from response or fallback, as quiz_id might be undefined for mock tests
            const resultTestId = response.data;
            navigate(`/quiz/results/${response.data.result.attempt_id}-mock-test`, {
                state: { attemptId: response.data.attempt?.id, isMockTest: true }
            });
        }
    }


    const handleSubmitQuiz = async () => {
        if (isSubmitting) return;

        setIsSubmitting(true);

        try {
            // Convert option indices to keys (0 -> 'a', 1 -> 'b', etc.)
            const optionKeys = ['a', 'b', 'c', 'd', 'e'];

            // For direct quizzes, calculate score locally (Fallback only)
            if (quizId === 'direct') {
                let correctCount = 0;
                const totalQuestions = quiz?.questions?.length || 0;

                quiz.questions.forEach(question => {
                    const userAnswer = answers[question.id];
                    if (userAnswer !== undefined && optionKeys[userAnswer] === question.correct_answer) {
                        correctCount++;
                    }
                });

                const quizResults = {
                    quiz_id: 'direct',
                    total_questions: totalQuestions,
                    correct_answers: correctCount,
                    incorrect_answers: totalQuestions - correctCount,
                    score: totalQuestions > 0 ? Math.round((correctCount / totalQuestions) * 100) : 0,
                    percentage: totalQuestions > 0 ? Math.round((correctCount / totalQuestions) * 100) : 0,
                    time_taken: quiz?.duration ? (quiz.duration * 60 - (timeRemaining || 0)) : 0,
                    questions: quiz.questions.map(q => ({
                        ...q,
                        user_answer: optionKeys[answers[q.id]],
                        is_correct: optionKeys[answers[q.id]] === q.correct_answer
                    }))
                };

                localStorage.setItem('quiz_results_direct', JSON.stringify(quizResults));
                dispatch(showNotification({
                    type: 'success',
                    message: `Test completed! Score: ${correctCount}/${totalQuestions}`
                }));

                navigate(`/quiz/results/direct`);
                return;
            }

            // For attempt-based quizzes, submit to API
            const attemptId = quizId;
            console.log('Submission Body:', {
                user_id: user?.user_id || user?.id,
                attempt_id: attemptId,
                subject_id: quiz?.subject_id,
                question_type: quiz?.question_type,
                time_taken_seconds: quiz?.duration ? (quiz.duration * 60 - (timeRemaining || 0)) : 0,
                answers: quiz?.questions?.map(q => ({
                    question_id: q.id,
                    selected_key: answers[q.id] !== undefined ? optionKeys[answers[q.id]] : null
                })) || []
            });
            // Determine if it's an attempt-based quiz (AMC Subject or Chapter)
            if (quiz?.attempt_id || quiz?.subject_id || location.state?.isSubjectQuiz || location.state?.isChapterQuiz) {
                const submissionData = {
                    user_id: user?.user_id || user?.id,
                    attempt_id: attemptId || quiz?.attempt_id,
                    subject_id: quiz?.subject_id,
                    question_type: (quiz?.question_type || 'easy').toLowerCase(),
                    time_taken_seconds: quiz?.duration ? (quiz.duration * 60 - (timeRemaining || 0)) : 0,
                    answers: quiz?.questions?.map(q => ({
                        question_id: q.id,
                        selected_key: answers[q.id] !== undefined ? optionKeys[answers[q.id]] : null
                    })) || []
                };
                const result = await dispatch(submitSubjectQuiz(submissionData)).unwrap();
                dispatch(showNotification({
                    type: 'success',
                    message: 'Test submitted successfully!'
                }));

                // For AMC, the result usually contains the quiz_id/attempt_id
                navigate(`/quiz/results/${result.attempt_id || attemptId}`);
                return;
            }

            const submissionData = {
                user_id: user?.user_id || user?.id,
                attempt_id: attemptId,
                time_taken_seconds: quiz?.duration ? (quiz.duration * 60 - (timeRemaining || 0)) : 0,
                answers: quiz?.questions?.map(q => ({
                    question_id: q.id,
                    selected_key: answers[q.id] !== undefined ? optionKeys[answers[q.id]] : null
                })) || []
            };

            // Check if this is a mock test submission
            // Use isMockTest flag (from location state) OR check Redux store if state was lost but store persists.
            if (isMockTest || (currentMockTest && currentMockTest.attempt?.id === attemptId)) {
                // Determine test_id safely
                // Determine test_id safely. Check currentMockTest first, then fallback to 'quiz' state (populated by fetchAttemptDetails)
                const testIdForSubmit =
                    currentMockTest?.test?.id ||
                    currentMockTest?.test_id ||
                    currentMockTest?.id ||
                    quiz?.test_id ||
                    quiz?.id; // Last resort fallback

                // Submit to mock test endpoint with new signature
                const result = await dispatch(submitMockTest({
                    // attempt_id: attemptId, // Pass explicit attempt_id
                    test_id: testIdForSubmit, // Pass explicit test_id
                    user_id: user?.user_id || user?.id,
                    // answers: Object.entries(answers).map(([questionId, answerIndex]) => ({
                    //     question_id: questionId,
                    //     selected_option: optionKeys[answerIndex]
                    // })),
                    // time_taken_seconds: quiz?.duration ? (quiz.duration * 60 - (timeRemaining || 0)) : 0
                })).unwrap();

                dispatch(showNotification({
                    type: 'success',
                    message: 'Mock test submitted successfully!'
                }));

                // Navigate to results page with mock test indicator
                // Priorities: 
                // 1. result.test_id (if returned by submit)
                // 2. currentMockTest.attempt.test_id (most reliable source from start)
                // 3. currentMockTest.test_id (if at top level)
                // 4. attemptId (fallback, might be wrong if API strictly needs test_id)
                const testId = result.test_id ||
                    currentMockTest?.attempt?.test_id ||
                    currentMockTest?.test_id ||
                    currentMockTest?.id ||
                    attemptId;
                navigate(`/quiz/results/${testId}-mock-test`, {
                    state: { attemptId: attemptId, isMockTest: true }
                });
            } else {
                // Submit to regular quiz endpoint
                const result = await dispatch(submitQuiz(submissionData)).unwrap();

                dispatch(showNotification({
                    type: 'success',
                    message: 'Test submitted successfully!'
                }));

                // Navigate to results page
                navigate(`/quiz/results/${result.quiz_id || attemptId}`);
            }
        } catch (error) {
            dispatch(showNotification({
                type: 'error',
                message: error || 'Failed to submit quiz'
            }));
            setIsSubmitting(false);
        }
    };

    const handleNextQuestion = () => {
        if (currentQuestionIndex < (quiz?.questions?.length || 0) - 1) {
            setCurrentQuestionIndex(prev => prev + 1);
        }
    };

    const handlePreviousQuestion = () => {
        if (currentQuestionIndex > 0) {
            setCurrentQuestionIndex(prev => prev - 1);
        }
    };

    const handleQuestionJump = (index) => {
        setCurrentQuestionIndex(index);
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 pt-32">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading test...</p>
                </div>
            </div>
        );
    }

    if (error || !quiz || !quiz.questions || quiz.questions.length === 0) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 pt-32">
                <div className="text-center max-w-md">
                    <svg className="w-16 h-16 text-red-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Test Not Found</h2>
                    <p className="text-gray-600 mb-6">{error || 'Unable to load test questions'}</p>
                    <button
                        onClick={() => navigate(-1)}
                        className="px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition"
                    >
                        Back to Chapters
                    </button>
                </div>
            </div>
        );
    }

    const currentQuestion = quiz.questions[currentQuestionIndex];
    const totalQuestions = quiz.questions.length;
    const answeredCount = Object.keys(answers).length;

    return (
        <div className="min-h-screen bg-gray-50 pt-20 sm:pt-32 pb-10">
            <div className="max-w-7xl mx-auto px-3 sm:px-4">
                {/* Header */}
                <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm p-3 sm:p-6 mb-4 sm:mb-6 sticky top-16 sm:top-24 z-10">
                    <div className="flex items-center justify-between gap-2">
                        <div className="min-w-0">
                            <h1 className="text-base sm:text-2xl font-bold text-gray-900 truncate">{quiz.title || 'Test'}</h1>
                            <p className="text-gray-600 text-xs sm:text-base mt-0.5 sm:mt-1">
                                Question {currentQuestionIndex + 1} of {totalQuestions}
                            </p>
                        </div>
                        {timeRemaining !== null && (
                            <div className={`text-center shrink-0 ${timeRemaining < 300 ? 'text-red-600' : 'text-gray-900'}`}>
                                <div className="text-[10px] sm:text-sm text-gray-600">Time Left</div>
                                <div className="text-xl sm:text-3xl font-bold">{formatTime(timeRemaining)}</div>
                            </div>
                        )}
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full bg-gray-200 rounded-full h-1.5 sm:h-2 mt-3 sm:mt-4">
                        <div
                            className="bg-orange-500 h-1.5 sm:h-2 rounded-full transition-all duration-300"
                            style={{ width: `${(answeredCount / totalQuestions) * 100}%` }}
                        ></div>
                    </div>
                    <p className="text-[10px] sm:text-sm text-gray-600 mt-1.5 sm:mt-2">
                        {answeredCount} of {totalQuestions} answered
                    </p>
                </div>

                {/* Main Content - Two Column Layout */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
                    {/* Left Column - Question Content */}
                    <div className="lg:col-span-2 space-y-4 sm:space-y-6">
                        {/* Question Card */}
                        <div className="bg-white rounded-xl shadow-md p-4 sm:p-8">
                            <div className="mb-4 sm:mb-6">
                                <div className="flex items-start justify-between mb-3 sm:mb-4 gap-2">
                                    <div className="flex-1 w-full">
                                        <div className="mb-3 text-[11px] sm:text-xs font-bold tracking-wide text-orange-600 bg-orange-50 inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-md border border-orange-200 shadow-sm">
                                            <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                                            Interactive Stem: Select text to highlight (Click a highlight to remove it)
                                        </div>
                                        <h2 
                                            id={`question-text-${currentQuestion.id}`}
                                            className="text-base sm:text-lg lg:text-xl font-semibold text-gray-900 select-text cursor-text leading-relaxed"
                                            onMouseUp={handleHighlight}
                                            onTouchEnd={handleHighlight}
                                            onClick={handleContainerClick}
                                            dangerouslySetInnerHTML={{
                                                __html: highlightedQuestions[currentQuestion.id] || (() => {
                                                    const qt = currentQuestion.question || currentQuestion.text || currentQuestion.title;
                                                    return typeof qt === 'object' ? (qt?.content || qt?.text || JSON.stringify(qt)) : (qt || 'Question text not available');
                                                })()
                                            }}
                                        >
                                        </h2>
                                    </div>
                                    {currentQuestion.marks && (
                                        <span className="ml-2 px-2 sm:px-3 py-0.5 sm:py-1 bg-orange-100 text-orange-600 rounded-full text-xs sm:text-sm font-semibold whitespace-nowrap shrink-0">
                                            {currentQuestion.marks} marks
                                        </span>
                                    )}
                                </div>

                                {/* Supplemental Question Image */}
                                {(currentQuestion.image_url || currentQuestion.question_image_url) && (
                                    <div className="mt-4 mb-2 bg-gray-50/50 rounded-xl p-2 sm:p-4 flex justify-center w-full border border-gray-100">
                                        <img 
                                            src={currentQuestion.image_url || currentQuestion.question_image_url} 
                                            alt="Question Visualization" 
                                            className="max-w-full md:max-w-xl max-h-[300px] object-contain rounded-lg shadow-sm"
                                            onError={(e) => { e.target.style.display = 'none'; }}
                                        />
                                    </div>
                                )}
                            </div>

                            {/* Options */}
                            <div className="space-y-2 sm:space-y-3">
                                {currentQuestion.options?.map((option, index) => (
                                    <label
                                        key={index}
                                        className={`flex items-start p-3 sm:p-4 border-2 rounded-xl sm:rounded-lg cursor-pointer transition-all ${answers[currentQuestion.id] === index
                                            ? 'border-orange-500 bg-orange-50'
                                            : 'border-gray-200 hover:border-orange-300 hover:bg-gray-50'
                                            }`}
                                    >
                                        <input
                                            type="radio"
                                            name={`question-${currentQuestion.id}`}
                                            value={index}
                                            checked={answers[currentQuestion.id] === index}
                                            onChange={() => handleAnswerSelect(currentQuestion.id, index)}
                                            className="w-4 h-4 sm:w-5 sm:h-5 text-orange-500 focus:ring-orange-500 mt-0.5 shrink-0"
                                        />
                                        <span className="ml-2.5 sm:ml-3 text-sm sm:text-base text-gray-800 select-text cursor-text">
                                            {typeof option === 'object' ? option?.content || JSON.stringify(option) : option}
                                        </span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        {/* Navigation */}
                        <div className="flex items-center justify-between gap-2">
                            <button
                                onClick={handlePreviousQuestion}
                                disabled={currentQuestionIndex === 0}
                                className="px-3 sm:px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base cursor-pointer"
                            >
                                ← Previous
                            </button>

                            {currentQuestionIndex === totalQuestions - 1 ? (
                                <button
                                    onClick={() => setIsShowSubmitModal(true)}
                                    disabled={isSubmitting}
                                    className="px-4 sm:px-8 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition disabled:opacity-50 text-sm sm:text-base cursor-pointer"
                                >
                                    {isSubmitting ? 'Submitting...' : 'Submit Test'}
                                </button>
                            ) : (
                                <button
                                    onClick={handleNextQuestion}
                                    className="px-4 sm:px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition text-sm sm:text-base cursor-pointer"
                                >
                                    Next →
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Right Column - Question Navigator */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-xl shadow-md p-4 sm:p-6 sticky top-48">
                            <h3 className="text-sm sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">Question Navigator</h3>

                            {/* Dynamic Grid */}
                            <div
                                className={`grid gap-1.5 sm:gap-2 max-h-[200px] lg:max-h-[calc(100vh-400px)] overflow-y-auto pr-1 sm:pr-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 ${totalQuestions <= 20 ? 'grid-cols-5' :
                                    totalQuestions <= 50 ? 'grid-cols-6 sm:grid-cols-6' :
                                        totalQuestions <= 100 ? 'grid-cols-7 sm:grid-cols-7' :
                                            'grid-cols-8'
                                    }`}
                            >
                                {quiz.questions.map((q, index) => (
                                    <button
                                        key={index}
                                        onClick={() => handleQuestionJump(index)}
                                        className={`aspect-square rounded-lg font-semibold transition text-xs sm:text-sm flex items-center justify-center cursor-pointer ${index === currentQuestionIndex
                                            ? 'bg-orange-500 text-white shadow-md'
                                            : answers[q.id] !== undefined
                                                ? 'bg-green-100 text-green-700 hover:bg-green-200'
                                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                            }`}
                                        title={`Question ${index + 1}${answers[q.id] !== undefined ? ' (Answered)' : ''}`}
                                    >
                                        {index + 1}
                                    </button>
                                ))}
                            </div>

                            {/* Legend */}
                            <div className="flex flex-row lg:flex-col gap-3 sm:gap-3 mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-gray-200 text-xs sm:text-sm flex-wrap">
                                <div className="flex items-center gap-1.5 sm:gap-2">
                                    <div className="w-4 h-4 sm:w-6 sm:h-6 bg-green-100 rounded flex-shrink-0"></div>
                                    <span className="text-gray-600">Answered ({answeredCount})</span>
                                </div>
                                <div className="flex items-center gap-1.5 sm:gap-2">
                                    <div className="w-4 h-4 sm:w-6 sm:h-6 bg-gray-100 rounded flex-shrink-0"></div>
                                    <span className="text-gray-600">Unanswered ({totalQuestions - answeredCount})</span>
                                </div>
                                <div className="flex items-center gap-1.5 sm:gap-2">
                                    <div className="w-4 h-4 sm:w-6 sm:h-6 bg-orange-500 rounded flex-shrink-0"></div>
                                    <span className="text-gray-600">Current</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Submit Confirmation Modal */}
            {isShowSubmitModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6 transform transition-all scale-100">
                        <div className="text-center">
                            <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg className="w-8 h-8 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">Submit Test?</h3>
                            <p className="text-gray-600 mb-6">
                                Are you sure you want to submit?
                            </p>

                            <div className="grid grid-cols-2 gap-4 mb-6">
                                <div className="bg-green-50 p-3 rounded-lg border border-green-100">
                                    <div className="text-2xl font-bold text-green-600">{answeredCount}</div>
                                    <div className="text-xs text-green-800 font-medium uppercase tracking-wide">Answered</div>
                                </div>
                                <div className="bg-gray-50 p-3 rounded-lg border border-gray-100">
                                    <div className="text-2xl font-bold text-gray-600">{totalQuestions - answeredCount}</div>
                                    <div className="text-xs text-gray-500 font-medium uppercase tracking-wide">Left</div>
                                </div>
                            </div>

                            <div className="flex gap-3">
                                <button
                                    onClick={() => setIsShowSubmitModal(false)}
                                    className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition font-medium"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={() => {
                                        setIsShowSubmitModal(false);
                                        if (isMockTest) {
                                            handlesubmitMockTest();
                                        } else {
                                            handleSubmitQuiz();
                                        }
                                    }}
                                    className="flex-1 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition font-medium"
                                >
                                    Yes, Submit
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default QuizTakingPage;

