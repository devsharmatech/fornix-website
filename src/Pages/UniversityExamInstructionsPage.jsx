import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import {
    fetchUniversityExamDetails,
    selectCurrentUniversityExam,
    selectUniversityExamsDetailsLoading,
    selectUniversityExamsError
} from '../redux/slices/universityExamsSlice';

const UniversityExamInstructionsPage = () => {
    const { examId } = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();

    // Try to get exam basic info from navigation state
    const stateExam = location.state?.exam;
    const courseId = location.state?.courseId;

    const currentExam = useSelector(selectCurrentUniversityExam);
    const loading = useSelector(selectUniversityExamsDetailsLoading);
    const error = useSelector(selectUniversityExamsError);

    useEffect(() => {
        if (examId) {
            dispatch(fetchUniversityExamDetails(examId));
        }
    }, [dispatch, examId]);

    const handleStartExam = () => {
        navigate(`/university-exams/${examId}/taking`, {
            state: { courseId, examName: currentExam?.exam_name || stateExam?.name }
        });
    };

    const handleGoBack = () => {
        navigate(-1);
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center pt-32 bg-gray-50">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
            </div>
        );
    }

    if (error && !currentExam) {
        const isAlreadyAttempted = error.toLowerCase().includes('already attempted') ||
            error.toLowerCase().includes('already try') ||
            error.toLowerCase().includes('completed') ||
            error.toLowerCase().includes('already taken');

        return (
            <div className="min-h-screen pt-32 pb-20 bg-gray-50">
                <div className="max-w-3xl mx-auto px-4">
                    {isAlreadyAttempted ? (
                        <div className="bg-orange-50 text-orange-800 p-8 rounded-3xl text-center shadow-sm border border-orange-100 mt-10">
                            <div className="mx-auto w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mb-6">
                                <svg className="w-8 h-8 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                            </div>
                            <h2 className="text-3xl font-bold mb-4 text-orange-900">Exam Already Attempted</h2>
                            <p className="text-orange-700 mb-8 text-lg font-medium">You have already completed this university exam. You cannot take it again.</p>
                            <div className="flex justify-center gap-4 flex-wrap">
                                <button onClick={handleGoBack} className="px-8 py-3 bg-white text-orange-600 border-2 border-orange-200 hover:bg-orange-50 rounded-xl font-bold transition-colors">Go Back</button>
                                <button onClick={() => navigate(`/university-exams/${examId}/result`, { state: { courseId } })} className="px-8 py-3 bg-orange-600 text-white hover:bg-orange-700 rounded-xl font-bold shadow-lg shadow-orange-200 transition-all">View Results</button>
                            </div>
                        </div>
                    ) : (
                        <div className="bg-red-50 text-red-600 p-8 rounded-3xl text-center shadow-sm border border-red-100 mt-10">
                            <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-6">
                                <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                            </div>
                            <h2 className="text-2xl font-bold mb-3 text-red-900">Error Loading Exam</h2>
                            <p className="text-red-700 mb-8">{error}</p>
                            <button onClick={handleGoBack} className="px-8 py-3 bg-red-600 text-white hover:bg-red-700 rounded-xl font-bold shadow-lg shadow-red-200 transition-all">Go Back</button>
                        </div>
                    )}
                </div>
            </div>
        );
    }

    // Use stateExam for basic info if API details aren't fully loaded yet or lack top-level metadata
    const title = currentExam?.exam_name || stateExam?.name || stateExam?.exam_name || 'University Exam';
    const subjects = currentExam?.exam_subjects || stateExam?.exam_subjects || 'General';
    const questionsCount = currentExam?.questions?.length || stateExam?.total_questions || 0;

    // Default to 60 mins if not provided, assuming standard duration
    const duration = currentExam?.duration_minutes || stateExam?.duration_minutes || 60;

    return (
        <div className="min-h-screen bg-gray-50 pt-32 pb-20">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* Header */}
                <div className="mb-8">
                    <button
                        onClick={handleGoBack}
                        className="flex items-center text-gray-500 hover:text-orange-600 transition-colors mb-6 font-medium"
                    >
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
                        Back to Course
                    </button>

                    <div className="flex items-center gap-3 mb-4">
                        <span className="bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-sm font-bold uppercase tracking-wide">
                            University Exam
                        </span>
                        <span className="bg-gray-200 text-gray-700 px-3 py-1 rounded-full text-sm font-bold">
                            {subjects}
                        </span>
                    </div>
                    <h1 className="text-3xl md:text-5xl font-extrabold text-gray-900 mb-4">{title}</h1>
                </div>

                {/* Main Content */}
                <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
                    {/* Top Stats Banner */}
                    <div className="bg-orange-600 p-8 text-white grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
                        <div>
                            <div className="text-orange-200 text-sm font-medium mb-1">Total Questions</div>
                            <div className="text-3xl font-bold flex items-center justify-center gap-2">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                {questionsCount}
                            </div>
                        </div>
                        <div>
                            <div className="text-orange-200 text-sm font-medium mb-1">Duration</div>
                            <div className="text-3xl font-bold flex items-center justify-center gap-2">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                {duration} <span className="text-base font-normal">Mins</span>
                            </div>
                        </div>
                        <div>
                            <div className="text-orange-200 text-sm font-medium mb-1">Total Marks</div>
                            <div className="text-3xl font-bold flex items-center justify-center gap-2">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                {questionsCount} <span className="text-base font-normal">Pts</span> {/* Assuming 1 pt each for now */}
                            </div>
                        </div>
                        <div>
                            <div className="text-orange-200 text-sm font-medium mb-1">Format</div>
                            <div className="text-xl font-bold flex items-center justify-center gap-2 mt-2">
                                Multiple Choice
                            </div>
                        </div>
                    </div>

                    {/* Instructions Body */}
                    <div className="p-8 md:p-12">
                        <h2 className="text-2xl font-bold text-gray-900 mb-6">Exam Instructions</h2>

                        <div className="space-y-4 mb-10 text-gray-600">
                            <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl">
                                <div className="bg-orange-100 text-orange-600 p-2 rounded-lg mt-0.5">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                </div>
                                <div>
                                    <h4 className="font-bold text-gray-900">Timing</h4>
                                    <p>The exam is timed for <strong>{duration} minutes</strong>. The timer will begin as soon as you click "Start Exam". If time runs out, your current answers will be automatically submitted.</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl">
                                <div className="bg-orange-100 text-orange-600 p-2 rounded-lg mt-0.5">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" /></svg>
                                </div>
                                <div>
                                    <h4 className="font-bold text-gray-900">Marking Scheme</h4>
                                    <p>Each question carries 1 mark. Ensure you review all options before selecting your final answer.</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-4 p-4 bg-yellow-50 rounded-xl border border-yellow-100">
                                <div className="bg-yellow-100 text-yellow-600 p-2 rounded-lg mt-0.5">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                                </div>
                                <div>
                                    <h4 className="font-bold text-yellow-900">Important Advisory</h4>
                                    <p className="text-yellow-800 text-sm">Do not close the browser window or refresh the page while taking the exam. Doing so may result in your attempt being invalidated.</p>
                                </div>
                            </div>
                        </div>

                        {/* Action Button */}
                        <div className="flex justify-center border-t border-gray-100 pt-8">
                            <button
                                onClick={handleStartExam}
                                disabled={!currentExam || loading || questionsCount === 0}
                                className={`px-12 py-4 rounded-xl font-bold text-lg text-white shadow-lg transition-all transform flex items-center justify-center gap-3 w-full sm:w-auto ${(!currentExam || loading || questionsCount === 0)
                                    ? 'bg-gray-400 cursor-not-allowed opacity-70'
                                    : 'bg-linear-to-r from-orange-600 to-orange-600 hover:shadow-orange-500/30 hover:scale-105'
                                    }`}
                            >
                                {loading ? 'Loading Exam...' : questionsCount === 0 ? 'No Questions Available' : 'Start Exam Now'}
                                {!loading && questionsCount > 0 && (
                                    <svg className="w-5 h-5 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                                )}
                            </button>
                        </div>
                        {questionsCount === 0 && !loading && (
                            <p className="text-center text-red-500 text-sm mt-3">This exam has no questions configured.</p>
                        )}
                    </div>
                </div>

            </div>
        </div>
    );
};

export default UniversityExamInstructionsPage;
