import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { FaBookOpen, FaClock, FaCalendarAlt, FaRedoAlt, FaChevronRight, FaTrophy, FaRegFrown, FaChartLine } from 'react-icons/fa';
import {
    fetchQuizHistory,
    resetQuiz,
    selectQuizHistory,
    selectQuizLoading,
    selectQuizError,
} from '../redux/slices/quizSlice';
import { selectUser } from '../redux/slices/authSlice';

function QuizHistoryPage() {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const user = useSelector(selectUser);
    const quizHistory = useSelector(selectQuizHistory);
    const loading = useSelector(selectQuizLoading);
    const error = useSelector(selectQuizError);

    const [filter, setFilter] = useState('all');
    const [sortBy, setSortBy] = useState('date');
    const [resetDialog, setResetDialog] = useState({ open: false, chapterId: null, quizTitle: '' });

    useEffect(() => {
        // Get user_id from user object - could be 'user_id', 'id', or 'uuid'
        const userId = user?.user_id || user?.id || user?.uuid;
        if (userId) {
            dispatch(fetchQuizHistory(userId));
        } else {
        }
    }, [dispatch, user]);

    useEffect(() => {
    }, [quizHistory]);

    const handleResetQuiz = async (chapterId, quizTitle) => {
        try {
            await dispatch(resetQuiz({ chapter_id: chapterId })).unwrap();
            // Refresh quiz history after reset
            const userId = user?.user_id || user?.id || user?.uuid;
            if (userId) {
                dispatch(fetchQuizHistory(userId));
            }
            setResetDialog({ open: false, chapterId: null, quizTitle: '' });
            // Show success notification (you can add a notification system)
            alert(`Quiz progress for "${quizTitle}" has been reset successfully!`);
        } catch (error) {
            alert(`Failed to reset quiz: ${error}`);
        }
    };

    const getScoreStyles = (percentage) => {
        if (percentage >= 80) return { text: 'text-orange-600', bg: 'bg-orange-50', border: 'border-orange-200', ribbon: 'bg-orange-500' };
        if (percentage >= 60) return { text: 'text-orange-600', bg: 'bg-orange-50', border: 'border-orange-200', ribbon: 'bg-orange-500' };
        if (percentage >= 40) return { text: 'text-orange-600', bg: 'bg-orange-50', border: 'border-orange-200', ribbon: 'bg-orange-500' };
        return { text: 'text-orange-600', bg: 'bg-orange-50', border: 'border-orange-200', ribbon: 'bg-orange-500' };
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const filteredHistory = React.useMemo(() => {
        if (!quizHistory || !Array.isArray(quizHistory)) return [];

        let filtered = [...quizHistory];

        // Apply filter
        if (filter !== 'all') {
            filtered = filtered.filter(quiz => quiz.course_name?.toLowerCase() === filter.toLowerCase());
        }

        // Apply sort
        filtered.sort((a, b) => {
            if (sortBy === 'date') {
                return new Date(b.completed_at || b.created_at) - new Date(a.completed_at || a.created_at);
            } else if (sortBy === 'score') {
                const scoreA = (a.correct_answers / a.total_questions) * 100;
                const scoreB = (b.correct_answers / b.total_questions) * 100;
                return scoreB - scoreA;
            }
            return 0;
        });

        return filtered;
    }, [quizHistory, filter, sortBy]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 pt-32">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading quiz history...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 pt-20 sm:pt-32 pb-8 sm:pb-12">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Modern Header */}
                <div className="mb-6 sm:mb-8 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                    <div className="text-center sm:text-left">
                        <h1 className="text-3xl sm:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-gray-900 to-gray-600 mb-2 tracking-tight">
                            Performance History
                        </h1>
                        <p className="text-gray-500 text-sm sm:text-base font-medium flex items-center justify-center sm:justify-start gap-2">
                            <FaChartLine className="text-orange-500 hidden sm:inline-block" />
                            Analyze your past test attempts and track growth
                        </p>
                    </div>
                </div>

                {/* Filters */}
                <div className="bg-white rounded-2xl shadow-[0_4px_20px_rgb(0,0,0,0.03)] border border-gray-100 p-4 sm:p-5 mb-6 sm:mb-8">
                    <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 items-center">
                        <div className="w-full sm:flex-1 relative">
                            <select
                                value={filter}
                                onChange={(e) => setFilter(e.target.value)}
                                className="w-full pl-4 pr-10 py-2.5 sm:py-3 text-sm font-semibold text-gray-700 border border-gray-200 rounded-xl focus:ring-4 focus:ring-orange-500/10 focus:border-orange-500 outline-none transition-all bg-gray-50/50 hover:bg-gray-50 appearance-none cursor-pointer"
                            >
                                <option value="all">All Courses / Subjects</option>
                                <option value="neet pg">NEET PG</option>
                                <option value="neet ug">NEET UG</option>
                                <option value="amc">AMC</option>
                            </select>
                            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                                <FaBookOpen />
                            </div>
                        </div>

                        <div className="w-full sm:flex-1 relative">
                            <select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                                className="w-full pl-4 pr-10 py-2.5 sm:py-3 text-sm font-semibold text-gray-700 border border-gray-200 rounded-xl focus:ring-4 focus:ring-orange-500/10 focus:border-orange-500 outline-none transition-all bg-gray-50/50 hover:bg-gray-50 appearance-none cursor-pointer"
                            >
                                <option value="date">Sort by Latest Attempt</option>
                                <option value="score">Sort by Highest Score</option>
                            </select>
                            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                                <FaClock />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Quiz History List */}
                {error && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                        <p className="text-red-800">{error}</p>
                    </div>
                )}

                {filteredHistory.length === 0 ? (
                    <div className="bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 p-12 sm:p-16 text-center">
                        <div className="w-20 sm:w-24 h-20 sm:h-24 bg-orange-50 rounded-full flex items-center justify-center mx-auto mb-6">
                            <FaChartLine className="w-8 sm:w-10 h-8 sm:h-10 text-orange-500" />
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-3 tracking-tight">No Test History Yet</h3>
                        <p className="text-gray-500 mb-8 max-w-sm mx-auto leading-relaxed text-sm sm:text-base">
                            Start testing your knowledge to see detailed performance analytics and history here.
                        </p>
                        <button
                            onClick={() => navigate('/courses')}
                            className="px-8 py-3.5 bg-gray-900 text-white font-semibold rounded-xl hover:bg-gray-800 transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5"
                        >
                            Explore Courses
                        </button>
                    </div>
                ) : (
                    <div className="space-y-4 sm:space-y-5">
                        {filteredHistory.map((quiz, index) => {
                            const percentage = quiz.total_questions > 0
                                ? Math.round((quiz.correct_answers / quiz.total_questions) * 100)
                                : 0;
                            const styles = getScoreStyles(percentage);

                            return (
                                <div
                                    key={quiz.id || index}
                                    className="relative bg-white rounded-2xl shadow-[0_4px_20px_rgb(0,0,0,0.03)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] border border-gray-100 p-5 sm:p-6 transition-all duration-300 cursor-pointer group overflow-hidden"
                                    onClick={() => navigate(`/quiz/results/${quiz.id}`)}
                                >
                                    {/* Left Status Ribbon */}
                                    <div className={`absolute top-0 left-0 w-1.5 h-full ${styles.ribbon} transition-all group-hover:w-2`} />

                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5 sm:gap-6 pl-2">
                                        <div className="flex items-start sm:items-center gap-4 sm:gap-5 flex-1">
                                            {/* Score Ring */}
                                            <div className={`relative w-[52px] h-[52px] sm:w-20 sm:h-20 rounded-full flex items-center justify-center shrink-0 border-4 sm:border-[5px] ${styles.border} ${styles.bg}`}>
                                                <div className={`text-base sm:text-2xl font-black ${styles.text}`}>
                                                    {percentage}%
                                                </div>
                                            </div>

                                            {/* Meta */}
                                            <div className="flex-1">
                                                <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2 group-hover:text-orange-500 transition-colors tracking-tight line-clamp-2">
                                                    {quiz.quiz_title || quiz.title || 'Practice Test'}
                                                </h3>
                                                
                                                <div className="flex flex-wrap gap-2.5 sm:gap-4 text-xs font-medium text-gray-500">
                                                    {quiz.course_name && (
                                                        <span className="flex items-center gap-1.5 bg-gray-50 px-2 sm:px-2.5 py-1 rounded-md border border-gray-100 text-gray-700">
                                                            <FaBookOpen className="text-gray-400" />
                                                            {quiz.course_name}
                                                        </span>
                                                    )}
                                                    <span className="flex items-center gap-1.5">
                                                        <FaCalendarAlt className="text-gray-400" />
                                                        {formatDate(quiz.completed_at || quiz.created_at)}
                                                    </span>
                                                    {quiz.time_taken && (
                                                        <span className="flex items-center gap-1.5 hidden sm:flex">
                                                            <FaClock className="text-gray-400" />
                                                            {quiz.time_taken}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-between sm:justify-end gap-5 w-full sm:w-auto pt-4 sm:pt-0 border-t border-dashed sm:border-0 border-gray-200 mt-1 sm:mt-0 pl-2 sm:pl-0">
                                            <div className="flex sm:hidden items-center gap-1.5 text-xs font-medium text-gray-500">
                                                <FaClock className="text-gray-400" />
                                                {quiz.time_taken || 'N/A'}
                                            </div>

                                            <div className="hidden sm:block text-right pr-4 border-r border-gray-100">
                                                <div className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1">Score</div>
                                                <div className="text-sm font-bold text-gray-700">
                                                    {quiz.correct_answers} / {quiz.total_questions}
                                                </div>
                                            </div>

                                            {quiz.chapter_id ? (
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setResetDialog({
                                                            open: true,
                                                            chapterId: quiz.chapter_id,
                                                            quizTitle: quiz.quiz_title || quiz.title || 'Test'
                                                        });
                                                    }}
                                                    className="flex items-center gap-2 px-4 py-2 sm:py-2.5 bg-white border-2 border-gray-200 text-gray-700 hover:border-red-500 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all font-bold text-xs sm:text-sm"
                                                    title="Delete history and retake"
                                                >
                                                    <FaRedoAlt />
                                                    Retake
                                                </button>
                                            ) : (
                                                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gray-50 flex items-center justify-center group-hover:bg-orange-50 group-hover:text-orange-500 transition-colors text-gray-400">
                                                    <FaChevronRight className="text-sm sm:text-base" />
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}

                {/* Reset Confirmation Dialog */}
                {resetDialog.open && (
                    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                        <div className="bg-white rounded-2xl shadow-2xl p-6 sm:p-8 max-w-md w-full mx-auto transform transition-all">
                            <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mb-4 sm:mb-6">
                                <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                </svg>
                            </div>
                            <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2 sm:mb-4">Retake Test?</h3>
                            <p className="text-sm sm:text-base text-gray-600 mb-6 sm:mb-8 leading-relaxed">
                                Are you sure you want to reset your progress for <strong className="text-gray-900 border-b border-gray-300 pb-0.5">"{resetDialog.quizTitle}"</strong>?
                                All previous attempts for this chapter will be deleted so you can start fresh.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                                <button
                                    onClick={() => setResetDialog({ open: false, chapterId: null, quizTitle: '' })}
                                    className="order-2 sm:order-1 flex-1 px-6 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition font-bold"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={() => handleResetQuiz(resetDialog.chapterId, resetDialog.quizTitle)}
                                    className="order-1 sm:order-2 flex-1 px-6 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 transition font-bold shadow-sm"
                                >
                                    Yes, Retake
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default QuizHistoryPage;

