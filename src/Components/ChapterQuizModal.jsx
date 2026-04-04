import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchChapterQuiz, selectQuizLoading } from '../redux/slices/quizSlice';
import { selectUser } from '../redux/slices/authSlice';
import { selectUserProfile } from '../redux/slices/userSlice';
import { showNotification } from '../redux/slices/uiSlice';
import { FiX, FiArrowRight, FiZap, FiShuffle } from 'react-icons/fi';
import { HiOutlineDocumentText } from 'react-icons/hi';

const ChapterQuizModal = ({ isOpen, onClose, chapter }) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const user = useSelector(selectUser);
    const userProfile = useSelector(selectUserProfile);
    const loading = useSelector(selectQuizLoading);

    const activeUser = userProfile || user;

    const [questionType, setQuestionType] = useState('mixed');

    if (!isOpen || !chapter) return null;

    // Extract stats from chapter
    const stats = chapter.stats || {};
    const totalQ = stats.total || 0;
    const easyStats = stats.easy || { total: 0, attempted: 0, unattempted: 0 };
    const modStats = stats.moderate || { total: 0, attempted: 0, unattempted: 0 };
    const diffStats = stats.difficult || { total: 0, attempted: 0, unattempted: 0 };
    const totalUnattempted = easyStats.unattempted + modStats.unattempted + diffStats.unattempted;

    const handleStart = async () => {
        try {
            const payload = {
                chapter_id: chapter.id,
                question_type: questionType.toLowerCase()
            };

            
            const result = await dispatch(fetchChapterQuiz(payload)).unwrap();
            
            
            onClose();
            const attemptId = result.attempt_id || result.data?.attempt_id;
            
            
            if (attemptId) {
                navigate(`/quiz/taking/${attemptId}`, { state: { isChapterQuiz: true } });
            } else {
                console.warn('ChapterQuizModal: No attempt_id found, using direct path');
                navigate('/quiz/taking/direct', { state: { isChapterQuiz: true } });
            }
            
        } catch (error) {
            console.error('Failed to start chapter quiz:', error);
            dispatch(showNotification({
                type: 'error',
                message: typeof error === 'string' ? error : (error?.message || 'Failed to start quiz')
            }));
        }
    };

    // Difficulty option config
    const difficulties = [
        {
            key: 'mixed',
            label: 'Mixed',
            subtitle: 'All difficulties combined',
            icon: <FiShuffle className="w-5 h-5" />,
            total: totalQ,
            unattempted: totalUnattempted,
            gradient: 'from-orange-500 to-orange-600',
            bgSelected: 'bg-gradient-to-br from-orange-500 to-orange-600',
            bgIdle: 'bg-white',
            borderSelected: 'border-orange-400 shadow-lg shadow-orange-100',
            borderIdle: 'border-gray-100 hover:border-orange-200',
            accentColor: 'text-orange-600',
            badgeBg: 'bg-orange-50 text-orange-700',
        },
        {
            key: 'easy',
            label: 'Easy',
            subtitle: 'Build confidence',
            icon: <span className="text-lg">🟢</span>,
            total: easyStats.total,
            unattempted: easyStats.unattempted,
            gradient: 'from-orange-500 to-green-600',
            bgSelected: 'bg-gradient-to-br from-orange-500 to-green-600',
            bgIdle: 'bg-white',
            borderSelected: 'border-orange-400 shadow-lg shadow-orange-100',
            borderIdle: 'border-gray-100 hover:border-orange-200',
            accentColor: 'text-orange-600',
            badgeBg: 'bg-orange-50 text-orange-700',
        },
        {
            key: 'moderate',
            label: 'Moderate',
            subtitle: 'Test your skills',
            icon: <span className="text-lg">🟡</span>,
            total: modStats.total,
            unattempted: modStats.unattempted,
            gradient: 'from-orange-500 to-orange-500',
            bgSelected: 'bg-gradient-to-br from-orange-500 to-orange-500',
            bgIdle: 'bg-white',
            borderSelected: 'border-orange-400 shadow-lg shadow-orange-100',
            borderIdle: 'border-gray-100 hover:border-orange-200',
            accentColor: 'text-orange-600',
            badgeBg: 'bg-orange-50 text-orange-700',
        },
        {
            key: 'difficult',
            label: 'Difficult',
            subtitle: 'Challenge yourself',
            icon: <span className="text-lg">🔴</span>,
            total: diffStats.total,
            unattempted: diffStats.unattempted,
            gradient: 'from-red-500 to-orange-600',
            bgSelected: 'bg-gradient-to-br from-red-500 to-orange-600',
            bgIdle: 'bg-white',
            borderSelected: 'border-red-400 shadow-lg shadow-red-100',
            borderIdle: 'border-gray-100 hover:border-red-200',
            accentColor: 'text-red-600',
            badgeBg: 'bg-red-50 text-red-700',
        },
    ];

    const selectedDiff = difficulties.find(d => d.key === questionType);

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={onClose}>
            <div
                className="bg-white rounded-3xl shadow-2xl w-full max-w-lg max-h-[90vh] flex flex-col overflow-hidden border border-gray-100"
                onClick={(e) => e.stopPropagation()}
                style={{ animation: 'modalSlideUp 0.35s cubic-bezier(0.16, 1, 0.3, 1)' }}
            >
                {/* --- HEADER --- */}
                <div className="bg-gradient-to-r from-orange-500 via-orange-500 to-orange-500 p-6 text-white relative overflow-hidden">
                    {/* Decorative circles */}
                    <div className="absolute top-0 right-0 w-28 h-28 bg-white/10 rounded-full -mr-10 -mt-10"></div>
                    <div className="absolute bottom-0 left-0 w-20 h-20 bg-white/5 rounded-full -ml-8 -mb-8"></div>
                    
                    <button 
                        onClick={onClose}
                        className="absolute z-20 top-4 right-4 text-white/80 hover:text-white cursor-pointer transition-colors bg-white/10 rounded-full p-1.5 hover:bg-white/20"
                    >
                        <FiX className="w-5 h-5" />
                    </button>
                    
                    <div className="relative z-10">
                        <div className="flex items-center gap-2 mb-2">
                            <FiZap className="w-5 h-5 text-yellow-200" />
                            <span className="text-xs font-bold uppercase tracking-widest text-white/80">Chapter Practice</span>
                        </div>
                        <h3 className="text-xl font-black leading-tight">{chapter.name || 'Chapter Quiz'}</h3>
                        {totalQ > 0 && (
                            <div className="flex items-center gap-3 mt-3">
                                <span className="inline-flex items-center gap-1.5 bg-white/15 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold">
                                    <HiOutlineDocumentText className="w-3.5 h-3.5" /> {totalQ} Questions
                                </span>
                                {totalUnattempted > 0 && (
                                    <span className="inline-flex items-center gap-1.5 bg-white/15 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold">
                                        {totalUnattempted} Unattempted
                                    </span>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                {/* --- BODY --- */}
                <div className="p-6 overflow-y-auto">
                    <label className="block text-[11px] font-black text-gray-400 uppercase tracking-widest mb-4">
                        Choose Difficulty Level
                    </label>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {difficulties.map((diff) => {
                            const isActive = questionType === diff.key;
                            return (
                                <button
                                    key={diff.key}
                                    onClick={() => setQuestionType(diff.key)}
                                    className={`relative cursor-pointer rounded-2xl border-2 p-4 text-left transition-all duration-300 group overflow-hidden ${
                                        isActive
                                            ? `${diff.bgSelected} ${diff.borderSelected} text-white scale-[1.02]`
                                            : `${diff.bgIdle} ${diff.borderIdle}`
                                    }`}
                                >
                                    {/* Selection indicator */}
                                    {isActive && (
                                        <div className="absolute top-2.5 right-2.5 w-5 h-5 bg-white/30 rounded-full flex items-center justify-center">
                                            <div className="w-2.5 h-2.5 bg-white rounded-full"></div>
                                        </div>
                                    )}

                                    {/* Icon & Label */}
                                    <div className="flex items-center gap-2.5 mb-2">
                                        <div className={`${isActive ? 'opacity-100' : 'opacity-80'}`}>
                                            {diff.icon}
                                        </div>
                                        <div>
                                            <div className={`font-black text-sm ${isActive ? 'text-white' : 'text-gray-800'}`}>
                                                {diff.label}
                                            </div>
                                            <div className={`text-[10px] font-medium ${isActive ? 'text-white/70' : 'text-gray-400'}`}>
                                                {diff.subtitle}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Stats */}
                                    <div className="flex items-center gap-2 mt-2">
                                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                                            isActive ? 'bg-white/20 text-white' : diff.badgeBg
                                        }`}>
                                            {diff.total} total
                                        </span>
                                        {diff.unattempted > 0 && (
                                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                                                isActive ? 'bg-white/20 text-white' : 'bg-orange-50 text-orange-600'
                                            }`}>
                                                {diff.unattempted} left
                                            </span>
                                        )}
                                    </div>

                                    {/* Hover glow for idle state */}
                                    {!isActive && (
                                        <div className="absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-5 transition-opacity duration-300" style={{ backgroundImage: `linear-gradient(135deg, var(--tw-gradient-stops))` }}></div>
                                    )}
                                </button>
                            );
                        })}
                    </div>

                    {/* --- ACTION BUTTONS --- */}
                    <div className="pt-6 flex flex-col sm:flex-row gap-3">
                        <button
                            onClick={onClose}
                            className="flex-1 py-3.5 text-gray-500 font-bold cursor-pointer rounded-2xl hover:bg-gray-50 transition-colors border border-gray-100"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleStart}
                            disabled={loading || (selectedDiff && selectedDiff.total === 0)}
                            className={`flex-[2] py-3.5 cursor-pointer text-white font-bold rounded-2xl shadow-xl hover:shadow-2xl hover:scale-[1.02] transform transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-2 ${
                                selectedDiff ? `bg-gradient-to-r ${selectedDiff.gradient}` : 'bg-gradient-to-r from-orange-500 to-orange-600'
                            }`}
                        >
                            {loading ? (
                                <>
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                    Starting...
                                </>
                            ) : (
                                <>
                                    <FiZap className="w-4 h-4" />
                                    <span>Start {selectedDiff?.label || ''} Quiz</span>
                                    <FiArrowRight className="w-4 h-4" />
                                </>
                            )}
                        </button>
                    </div>

                    {/* Disabled hint */}
                    {selectedDiff && selectedDiff.total === 0 && (
                        <p className="text-center text-xs text-red-400 mt-3 font-medium">
                            No questions available for this difficulty level.
                        </p>
                    )}
                </div>
            </div>

            {/* Animation keyframe */}
            <style>{`
                @keyframes modalSlideUp {
                    from { opacity: 0; transform: translateY(20px) scale(0.97); }
                    to { opacity: 1; transform: translateY(0) scale(1); }
                }
            `}</style>
        </div>
    );
};

export default ChapterQuizModal;
