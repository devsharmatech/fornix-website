import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { startSubjectQuiz, selectQuizLoading } from '../redux/slices/quizSlice';
import { selectUser } from '../redux/slices/authSlice';
import { selectUserProfile } from '../redux/slices/userSlice';
import { showNotification } from '../redux/slices/uiSlice';

const SubjectQuizModal = ({ isOpen, onClose, subject }) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const user = useSelector(selectUser);
    const userProfile = useSelector(selectUserProfile);
    const loading = useSelector(selectQuizLoading);

    const activeUser = userProfile || user;

    const [config, setConfig] = useState({
        limit: 20,
        question_type: 'Easy'
    });

    if (!isOpen || !subject) return null;

    const handleStart = async () => {
        try {
            const payload = {
                subject_id: subject.id,
                user_id: activeUser?.user_id || activeUser?.id,
                limit: config.limit,
                question_type: config.question_type.toLowerCase()
            };

            
            const result = await dispatch(startSubjectQuiz(payload)).unwrap();
            
            
            // The API returns an attempt object with an id
            const attemptId = result.attempt?.id || result.attempt_id;
            
            
            if (attemptId) {
                onClose();
                navigate(`/quiz/taking/${attemptId}`, { state: { isSubjectQuiz: true } });
            } else {
                // Fallback to direct if no attempt ID (though unlikely for this API)
                onClose();
                navigate('/quiz/taking/direct');
            }
        } catch (error) {
            console.error('Failed to start subject quiz:', error);
            dispatch(showNotification({
                type: 'error',
                message: typeof error === 'string' ? error : (error?.message || 'Failed to start quiz')
            }));
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden animate-scale-up border border-gray-100">
                <div className="bg-linear-to-r from-orange-600 to-orange-600 p-8 text-white relative">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
                    <button 
                        onClick={onClose}
                        className="absolute top-4 right-4 text-white/80 hover:text-white transition-colors"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                    <h3 className="text-2xl font-bold relative z-10 mb-1">Subject Practice</h3>
                    <p className="text-orange-100 text-sm relative z-10 font-medium">{subject.name}</p>
                </div>

                <div className="p-8 space-y-8">
                    {/* Question Limit */}
                    <div className="space-y-4">
                        <label className="block text-sm font-bold text-gray-700 uppercase tracking-wider">
                            Number of Questions
                        </label>
                        <div className="grid grid-cols-4 gap-3">
                            {[10, 20, 30, 50].map((num) => (
                                <button
                                    key={num}
                                    onClick={() => setConfig({ ...config, limit: num })}
                                    className={`py-3 rounded-xl font-bold transition-all duration-200 border-2 ${
                                        config.limit === num
                                            ? 'bg-orange-600 border-orange-600 text-white shadow-lg shadow-orange-100 scale-105'
                                            : 'bg-white border-gray-100 text-gray-500 hover:border-orange-200 hover:text-orange-600'
                                    }`}
                                >
                                    {num}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Difficulty */}
                    <div className="space-y-4">
                        <label className="block text-sm font-bold text-gray-700 uppercase tracking-wider">
                            Difficulty Level
                        </label>
                        <div className="grid grid-cols-3 gap-3">
                            {['Easy', 'Moderate', 'Hard'].map((type) => (
                                <button
                                    key={type}
                                    onClick={() => setConfig({ ...config, question_type: type })}
                                    className={`py-3 px-2 rounded-xl font-bold transition-all duration-200 border-2 ${
                                        config.question_type === type
                                            ? 'bg-orange-600 border-orange-600 text-white shadow-lg shadow-orange-100 scale-105'
                                            : 'bg-white border-gray-100 text-gray-500 hover:border-orange-200 hover:text-orange-600'
                                    }`}
                                >
                                    {type}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="pt-4 flex gap-4">
                        <button
                            onClick={onClose}
                            className="flex-1 py-4 text-gray-500 font-bold rounded-2xl hover:bg-gray-50 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleStart}
                            disabled={loading}
                            className="flex-[2] py-4 bg-linear-to-r from-orange-600 to-orange-600 text-white font-bold rounded-2xl shadow-xl shadow-orange-100 hover:shadow-2xl hover:scale-[1.02] transform transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {loading ? (
                                <>
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                    Starting...
                                </>
                            ) : (
                                <>
                                    <span>Start Practice</span>
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                    </svg>
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SubjectQuizModal;
