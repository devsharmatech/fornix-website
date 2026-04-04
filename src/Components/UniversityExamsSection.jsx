import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
    fetchUniversityExamsList,
    fetchUniversityExamsHistory,
    selectUniversityExamsList,
    selectUniversityExamsHistory,
    selectUniversityExamsLoading
} from '../redux/slices/universityExamsSlice';
import { selectUser } from '../redux/slices/authSlice';

const UniversityExamsSection = ({ courseId }) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const exams = useSelector(selectUniversityExamsList);
    const history = useSelector(selectUniversityExamsHistory);
    const loading = useSelector(selectUniversityExamsLoading);
    const user = useSelector(selectUser);

    const [activeTab, setActiveTab] = useState('available'); // 'available' or 'history'

    useEffect(() => {
        // Only fetch if user is enrolled in a university
        if (user?.university_id) {
            dispatch(fetchUniversityExamsList());
            dispatch(fetchUniversityExamsHistory());
        }
    }, [dispatch, user?.university_id]);

    // Fast-fail if not enrolled 
    if (!user?.university_id) return null;

    // Filter exams that belong to this specific course if exam data has a course_id
    // Adjust this filtering based on actual API response structure if needed.
    // If the API automatically returns only relevant exams, this filter can be removed.
    // Assuming 'course_id' exists on the exam object:
    const displayExams = exams.filter(exam => !courseId || exam.course_id === courseId || !exam.course_id);
    const displayHistory = history.filter(attempt => !courseId || attempt.course_id === courseId || !attempt.course_id);

    const handleStartExam = (exam) => {
        // Navigate to instructions page first
        navigate(`/university-exams/${exam.id || exam.exam_id}/instructions`, { state: { exam, courseId } });
    };

    const handleViewResult = (attempt) => {
        // Navigate to result page
        navigate(`/university-exams/${attempt.exam_id}/result`, { state: { attempt, courseId } });
    };

    if (loading && exams.length === 0) {
        return (
            <div className="flex justify-center items-center py-10">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600"></div>
            </div>
        );
    }

    // Removed the null return so the header block still shows even when empty

    return (
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 mb-10">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <h2 className="text-3xl font-extrabold text-gray-900 flex items-center gap-3">
                        <span className="text-4xl">🎓</span>
                        University Exams
                    </h2>
                    <p className="text-gray-500 mt-2">Test your knowledge with comprehensive university-level exams.</p>
                </div>

                {/* Tabs */}
                <div className="flex bg-gray-100 p-1 rounded-xl w-fit">
                    <button
                        onClick={() => setActiveTab('available')}
                        className={`px-6 py-2.5 rounded-lg text-sm font-bold transition-all duration-300 ${activeTab === 'available'
                            ? 'bg-white text-orange-600 shadow-sm'
                            : 'text-gray-500 hover:text-gray-800 hover:bg-gray-200'
                            }`}
                    >
                        Available Exams
                        <span className={`ml-2 px-2 py-0.5 rounded-full text-xs ${activeTab === 'available' ? 'bg-orange-100 text-orange-700' : 'bg-gray-200 text-gray-600'}`}>
                            {displayExams.length}
                        </span>
                    </button>

                    <button
                        onClick={() => setActiveTab('history')}
                        className={`px-6 py-2.5 rounded-lg text-sm font-bold transition-all duration-300 ${activeTab === 'history'
                            ? 'bg-white text-orange-600 shadow-sm'
                            : 'text-gray-500 hover:text-gray-800 hover:bg-gray-200'
                            }`}
                    >
                        History
                        {displayHistory.length > 0 && (
                            <span className={`ml-2 px-2 py-0.5 rounded-full text-xs ${activeTab === 'history' ? 'bg-orange-100 text-orange-700' : 'bg-gray-200 text-gray-600'}`}>
                                {displayHistory.length}
                            </span>
                        )}
                    </button>
                </div>
            </div>

            {activeTab === 'available' && (
                displayExams.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {displayExams.map((exam) => (
                            <div
                                key={exam.id || exam.exam_id}
                                className="group bg-white rounded-2xl p-6 border border-gray-100 hover:border-orange-300 hover:shadow-xl transition-all duration-300 relative overflow-hidden flex flex-col h-full"
                            >
                                {/* Decorative background circle */}
                                <div className="absolute top-0 right-0 w-32 h-32 bg-linear-to-br from-orange-50 to-transparent rounded-bl-full opacity-50 group-hover:scale-110 transition-transform -mr-4 -mt-4 pointer-events-none"></div>

                                <div className="relative z-10 flex-grow">
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="w-12 h-12 bg-orange-50 text-orange-600 rounded-xl flex items-center justify-center font-bold text-xl group-hover:scale-110 group-hover:bg-orange-600 group-hover:text-white transition-all duration-300 shadow-sm">
                                            {exam.name ? exam.name.charAt(0) : 'E'}
                                        </div>
                                        <div>
                                            <span className="text-xs font-bold text-orange-600 uppercase tracking-wider bg-orange-50 px-2 py-1 rounded-md">
                                                {exam.exam_subjects || 'General'}
                                            </span>
                                        </div>
                                    </div>

                                    <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-orange-600 transition-colors line-clamp-2">
                                        {exam.name || exam.exam_name || 'University Exam'}
                                    </h3>

                                    <div className="flex items-center gap-4 text-sm text-gray-500 mb-6">
                                        {exam.duration_minutes && (
                                            <span className="flex items-center gap-1">
                                                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                                {exam.duration_minutes} Mins
                                            </span>
                                        )}
                                        {exam.total_questions && (
                                            <span className="flex items-center gap-1">
                                                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                                {exam.total_questions} Questions
                                            </span>
                                        )}
                                    </div>
                                </div>

                                <button
                                    onClick={() => handleStartExam(exam)}
                                    className="mt-auto w-full py-3 bg-gray-50 text-gray-900 font-bold rounded-xl group-hover:bg-orange-600 group-hover:text-white transition-all duration-300 flex items-center justify-center gap-2"
                                >
                                    Start Exam
                                    <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                    </svg>
                                </button>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-16 bg-gray-50 rounded-2xl border border-gray-100 border-dashed">
                        <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
                            <span className="text-2xl">📝</span>
                        </div>
                        <h3 className="text-lg font-bold text-gray-900 mb-1">No Exams Available</h3>
                        <p className="text-gray-500">There are currently no university exams assigned to this course.</p>
                    </div>
                )
            )}

            {activeTab === 'history' && (
                displayHistory.length > 0 ? (
                    <div className="space-y-4">
                        {displayHistory.map((attempt) => {
                            const percentage = attempt.total_marks > 0 ? Math.round((attempt.score / attempt.total_marks) * 100) : 0;
                            const isPass = percentage >= 50; // Arbitrary pass threshold, adjust if needed

                            return (
                                <div key={attempt.attempt_id} className="bg-white border text-left border-gray-100 rounded-xl p-5 hover:border-orange-200 hover:shadow-md transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                    <div className="flex items-center gap-4">
                                        <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg ${isPass ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                            {percentage}%
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-gray-900 text-lg">{attempt.exam_name || 'University Exam'}</h4>
                                            <div className="flex items-center gap-3 text-sm text-gray-500 mt-1">
                                                <span className="flex items-center gap-1">
                                                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                                    Score: {attempt.score}/{attempt.total_marks}
                                                </span>
                                                <span>•</span>
                                                <span className="flex items-center gap-1">
                                                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                                                    {new Date(attempt.completed_at).toLocaleDateString()}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => handleViewResult(attempt)}
                                        className="px-6 py-2 bg-orange-50 text-orange-600 font-bold rounded-lg hover:bg-orange-600 hover:text-white transition-colors flex items-center gap-2"
                                    >
                                        Review
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                                    </button>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <div className="text-center py-16 bg-gray-50 rounded-2xl border border-gray-100 border-dashed">
                        <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
                            <span className="text-2xl">⏳</span>
                        </div>
                        <h3 className="text-lg font-bold text-gray-900 mb-1">No Attempt History</h3>
                        <p className="text-gray-500">You haven't taken any university exams yet. Your past attempts will appear here.</p>
                    </div>
                )
            )}
        </div>
    );
};

export default UniversityExamsSection;
