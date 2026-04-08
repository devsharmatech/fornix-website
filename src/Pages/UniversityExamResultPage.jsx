import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import AudioPlayer from '../Components/AudioPlayer';
import {
    fetchUniversityExamResult,
    selectUniversityExamResult,
    selectUniversityExamsResultLoading,
    selectUniversityExamsError,
    clearExamResult
} from '../redux/slices/universityExamsSlice';
import { selectUser } from '../redux/slices/authSlice';

const AudioExplanationSection = ({ question, globalLang, globalGender }) => {
    const audioUrls = question.explanation_audio_urls || {};
    const maleUrl = question.male_explanation_audio_url;
    const femaleUrl = question.female_explanation_audio_url;

    let selectedLangAudio = audioUrls[globalLang];
    if (!selectedLangAudio && globalLang && globalLang !== 'en') {
        selectedLangAudio = audioUrls['en'] || audioUrls['EN'];
    }

    let currentAudioUrl = null;
    if (selectedLangAudio) {
        if (typeof selectedLangAudio === 'string') {
            currentAudioUrl = selectedLangAudio;
        } else if (typeof selectedLangAudio === 'object') {
            currentAudioUrl = globalGender === 'male'
                ? (selectedLangAudio.male || selectedLangAudio.female || null)
                : (selectedLangAudio.female || selectedLangAudio.male || null);
        }
    } else {
        currentAudioUrl = globalGender === 'male'
            ? (maleUrl || femaleUrl || null)
            : (femaleUrl || maleUrl || null);
    }

    if (!currentAudioUrl || typeof currentAudioUrl !== 'string' || currentAudioUrl.trim() === '') {
        return null;
    }

    return (
        <div className="mt-4 p-3 sm:p-4 bg-white/50 rounded-xl border border-orange-100 shadow-sm">
            <div className="flex items-center gap-2 mb-2 sm:mb-3">
                <span className="text-lg sm:text-xl">🎧</span>
                <p className="text-xs sm:text-sm font-bold text-orange-900 uppercase tracking-wider">Audio Explanation</p>
            </div>
            <AudioPlayer audioUrl={currentAudioUrl} autoPlay={false} />
        </div>
    );
};

const UniversityExamResultPage = () => {
    const { examId } = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    const courseId = location.state?.courseId;

    // Sometimes the attempt object may be passed directly from history view
    const stateAttempt = location.state?.attempt;

    const resultData = useSelector(selectUniversityExamResult);
    const loading = useSelector(selectUniversityExamsResultLoading);
    const error = useSelector(selectUniversityExamsError);
    const user = useSelector(selectUser);

    const [activeFilter, setActiveFilter] = useState('all'); // all, correct, incorrect, skipped
    const [globalLang, setGlobalLang] = useState('en');
    const [globalGender, setGlobalGender] = useState('female');

    useEffect(() => {
        if (user?.preferred_language) {
            setGlobalLang(user.preferred_language);
        }
    }, [user?.preferred_language]);

    useEffect(() => {
        // If we have an examId in the URL, fetch the latest result for it
        if (examId) {
            // The API only needs exam_id on the URL and user_id in body, 
            // but it will return the latest attempt for that exam OR error if not attempted
            // If we clicked from history, we might prefer using just the passed data, 
            // but to ensure we have questions_review we fetch:
            dispatch(fetchUniversityExamResult(examId));
        }

        return () => {
            dispatch(clearExamResult());
        };
    }, [dispatch, examId]);

    const handleGoBack = () => {
        // Navigate back to the course if we know it, otherwise dashboard
        if (courseId) {
            // Depending on how routing is set up, you might navigate differently.
            navigate(-1); // Simplest fallback
        } else {
            navigate('/dashboard');
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center pt-32 bg-gray-50">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
            </div>
        );
    }

    if (error && !resultData) {
        return (
            <div className="min-h-screen pt-32 pb-20 bg-gray-50">
                <div className="max-w-3xl mx-auto px-4">
                    <div className="bg-red-50 text-red-600 p-6 rounded-2xl text-center">
                        <svg className="w-12 h-12 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        <h2 className="text-xl font-bold mb-2">Error Loading Result</h2>
                        <p>{error}</p>
                        <button onClick={handleGoBack} className="mt-6 px-6 py-2 bg-red-600 text-white rounded-lg font-bold">Go Back</button>
                    </div>
                </div>
            </div>
        );
    }

    // The API response for result gives `attempt` object and `questions_review` array
    // Sometimes it places attempt details directly on the root object
    const attemptInfo = resultData?.attempt || resultData || stateAttempt;
    const questionsReview = resultData?.questions_review || [];

    const score = attemptInfo?.score || 0;
    const total = attemptInfo?.total_marks || 0;
    const percentage = total > 0 ? Math.round((score / total) * 100) : 0;
    const isPass = percentage >= 50;

    // Filter questions for the review section
    const getFilteredQuestions = () => {
        if (!questionsReview || questionsReview.length === 0) return [];

        switch (activeFilter) {
            case 'correct':
                return questionsReview.filter(q => q.is_correct);
            case 'incorrect':
                return questionsReview.filter(q => !q.is_correct && q.student_answer);
            case 'skipped':
                return questionsReview.filter(q => !q.student_answer);
            default:
                return questionsReview;
        }
    };

    const filteredQuestions = getFilteredQuestions();

    const correctCount = questionsReview.filter(q => q.is_correct).length;
    const incorrectCount = questionsReview.filter(q => !q.is_correct && q.student_answer).length;
    const skippedCount = questionsReview.filter(q => !q.student_answer).length;

    return (
        <div className="min-h-screen bg-gray-50 pt-32 pb-20">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* Header */}
                <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
                    <div>
                        <button
                            onClick={handleGoBack}
                            className="flex items-center text-gray-500 hover:text-orange-600 transition-colors mb-4 font-medium"
                        >
                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
                            Go Back
                        </button>
                        <h1 className="text-3xl md:text-5xl font-extrabold text-gray-900 mb-2">Exam Result</h1>
                        <p className="text-gray-500 text-lg">{attemptInfo?.exam_name || attemptInfo?.exam_subjects || 'University Exam'}</p>
                    </div>
                    <div className="bg-white px-6 py-3 rounded-xl border border-gray-200 shadow-sm flex items-center gap-3 w-fit">
                        <span className="text-sm font-bold text-gray-400 uppercase tracking-widest">Completed</span>
                        <span className="text-gray-900 font-bold">
                            {attemptInfo?.completed_at ? new Date(attemptInfo.completed_at).toLocaleString() : 'Just now'}
                        </span>
                    </div>
                </div>

                {/* Score Banner */}
                <div className={`rounded-3xl shadow-xl overflow-hidden mb-12 ${isPass ? 'bg-linear-to-br from-orange-600 to-orange-700' : 'bg-linear-to-br from-red-600 to-orange-600'}`}>
                    <div className="p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden">
                        {/* Decorative faint circles */}
                        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-2xl -mr-20 -mt-20 pointer-events-none"></div>
                        <div className="absolute bottom-0 left-10 w-40 h-40 bg-white/10 rounded-full blur-2xl pointer-events-none"></div>

                        <div className="relative z-10 text-center md:text-left">
                            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md px-4 py-1.5 rounded-full text-white/90 text-sm font-bold uppercase tracking-widest mb-4">
                                {isPass ? 'Passing Score Achieved' : 'Needs Improvement'}
                            </div>
                            <h2 className="text-4xl md:text-6xl font-extrabold text-white mb-2">
                                {percentage}%
                            </h2>
                            <p className="text-white/80 text-xl font-medium">
                                You scored {score} out of {total} possible marks.
                            </p>
                        </div>

                        <div className="relative z-10 grid grid-cols-2 gap-4 w-full md:w-auto">
                            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-5 border border-white/20 text-center min-w-[120px]">
                                <div className="text-white/70 text-sm font-bold uppercase tracking-widest mb-1">Correct</div>
                                <div className="text-3xl font-extrabold text-white">{correctCount || attemptInfo?.stats?.correct || 0}</div>
                            </div>
                            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-5 border border-white/20 text-center min-w-[120px]">
                                <div className="text-white/70 text-sm font-bold uppercase tracking-widest mb-1">Incorrect</div>
                                <div className="text-3xl font-extrabold text-white">{incorrectCount || attemptInfo?.stats?.incorrect || 0}</div>
                            </div>
                            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-5 border border-white/20 text-center min-w-[120px] col-span-2">
                                <div className="text-white/70 text-sm font-bold uppercase tracking-widest mb-1">Skipped</div>
                                <div className="text-3xl font-extrabold text-white">{skippedCount || attemptInfo?.stats?.skipped || 0}</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Detailed Review Section */}
                {questionsReview && questionsReview.length > 0 && (
                    <div>
                        <div className="flex flex-col sm:flex-row items-center justify-between mb-8 pb-4 border-b border-gray-200">
                            <h3 className="text-2xl font-bold text-gray-900 mb-4 sm:mb-0">Question Review</h3>

                            <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
                                {/* Audio Settings */}
                                <div className="flex items-center gap-2">
                                    <div className="flex items-center gap-2 bg-orange-50 border border-orange-200 rounded-lg px-3 py-2">
                                        <span className="text-xs font-bold text-orange-700 uppercase">Lang:</span>
                                        <select
                                            value={globalLang}
                                            onChange={(e) => setGlobalLang(e.target.value)}
                                            className="text-xs font-bold bg-transparent border-none focus:ring-0 cursor-pointer text-orange-900 p-0"
                                        >
                                            <option value="en">English</option>
                                            <option value="hi">Hinglish</option>
                                        </select>
                                    </div>
                                    <div className="flex bg-white rounded-lg p-1 border border-orange-200">
                                        {['female', 'male'].map((g) => (
                                            <button
                                                key={g}
                                                onClick={() => setGlobalGender(g)}
                                                className={`px-3 py-1 text-xs font-bold rounded-md transition-all ${
                                                    globalGender === g
                                                        ? 'bg-orange-100 text-orange-700 shadow-inner'
                                                        : 'text-gray-500 hover:text-gray-700'
                                                }`}
                                            >
                                                {g.charAt(0).toUpperCase() + g.slice(1)}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Filters */}
                                <div className="flex bg-gray-100 p-1 rounded-xl scrollbar-hide overflow-x-auto w-full sm:w-auto">
                                    <button
                                        onClick={() => setActiveFilter('all')}
                                        className={`flex-1 sm:flex-none px-4 py-2 rounded-lg text-sm font-bold transition-all whitespace-nowrap ${activeFilter === 'all' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-800'}`}
                                    >
                                        All ({questionsReview.length})
                                    </button>
                                    <button
                                        onClick={() => setActiveFilter('correct')}
                                        className={`flex-1 sm:flex-none px-4 py-2 rounded-lg text-sm font-bold transition-all whitespace-nowrap ${activeFilter === 'correct' ? 'bg-white text-green-600 shadow-sm' : 'text-gray-500 hover:text-green-600'}`}
                                    >
                                        Correct
                                    </button>
                                    <button
                                        onClick={() => setActiveFilter('incorrect')}
                                        className={`flex-1 sm:flex-none px-4 py-2 rounded-lg text-sm font-bold transition-all whitespace-nowrap ${activeFilter === 'incorrect' ? 'bg-white text-red-600 shadow-sm' : 'text-gray-500 hover:text-red-600'}`}
                                    >
                                        Incorrect
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-8">
                            {filteredQuestions.map((q, index) => {
                                const isCorrect = q.is_correct;
                                const isSkipped = !q.student_answer;

                                // Original index in the full array for numbering
                                const displayNum = questionsReview.findIndex(orig => orig.id === q.id) + 1;

                                return (
                                    <div key={q.id} className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                                        <div className={`px-6 py-4 flex items-center justify-between border-b ${isCorrect
                                                ? 'bg-green-50/50 border-green-100'
                                                : isSkipped
                                                    ? 'bg-gray-50 border-gray-200'
                                                    : 'bg-red-50/50 border-red-100'
                                            }`}>
                                            <span className={`font-bold text-sm tracking-widest uppercase ${isCorrect ? 'text-green-700' : isSkipped ? 'text-gray-500' : 'text-red-700'
                                                }`}>
                                                Question {displayNum}
                                            </span>
                                            <div className="flex items-center gap-2">
                                                {isCorrect ? (
                                                    <span className="flex items-center bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold">
                                                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                                                        Correct (+{q.earned_marks})
                                                    </span>
                                                ) : isSkipped ? (
                                                    <span className="flex items-center bg-gray-200 text-gray-700 px-3 py-1 rounded-full text-xs font-bold">
                                                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 12H6" /></svg>
                                                        Skipped (0)
                                                    </span>
                                                ) : (
                                                    <span className="flex items-center bg-red-100 text-red-700 px-3 py-1 rounded-full text-xs font-bold">
                                                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                                                        Incorrect (0)
                                                    </span>
                                                )}
                                            </div>
                                        </div>

                                        <div className="p-6 md:p-8">
                                            <h4 className="text-xl font-bold text-gray-900 mb-6">{q.question}</h4>

                                            <div className="space-y-3 mb-8">
                                                {['a', 'b', 'c', 'd', 'e', 'f'].map(optLabel => {
                                                    const optText = q[`option_${optLabel}`];
                                                    if (!optText) return null;

                                                    const isStudentAns = q.student_answer === optLabel;
                                                    const isCorrectAns = q.correct_option === optLabel;

                                                    let optStyle = "border-gray-200 text-gray-700";
                                                    let bgStyle = "bg-white";
                                                    let icon = null;

                                                    if (isCorrectAns) {
                                                        optStyle = "border-green-500 text-green-800";
                                                        bgStyle = "bg-green-50";
                                                        icon = <svg className="w-6 h-6 text-green-500 ml-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>;
                                                    } else if (isStudentAns && !isCorrect) {
                                                        optStyle = "border-red-400 text-red-800";
                                                        bgStyle = "bg-red-50";
                                                        icon = <svg className="w-6 h-6 text-red-500 ml-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>;
                                                    }

                                                    return (
                                                        <div key={optLabel} className={`flex items-start p-4 rounded-xl border-2 ${optStyle} ${bgStyle}`}>
                                                            <div className={`flex-shrink-0 w-7 h-7 rounded-full border-2 flex items-center justify-center mr-4 mt-0.5 font-bold text-xs ${isCorrectAns ? 'bg-green-500 border-green-500 text-white' :
                                                                    (isStudentAns && !isCorrect) ? 'bg-red-500 border-red-500 text-white' :
                                                                        'border-gray-300 text-gray-400'
                                                                }`}>
                                                                {optLabel.toUpperCase()}
                                                            </div>
                                                            <span className="text-base font-medium flex-grow pr-4 group-hover:text-orange-900">{optText}</span>
                                                            {icon}
                                                        </div>
                                                    );
                                                })}
                                            </div>

                                            {/* Explanation Box */}
                                            {q.explanation && (
                                                <div className="bg-orange-50 border border-orange-100 rounded-2xl p-6 relative">
                                                    <div className="absolute top-0 left-6 -mt-3 bg-orange-100 text-orange-700 px-3 py-0.5 rounded-full text-xs font-bold uppercase flex items-center gap-1 border border-orange-200">
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                                        Explanation
                                                    </div>
                                                    <p className="text-orange-900 whitespace-pre-line pt-2">{q.explanation}</p>
                                                    <AudioExplanationSection
                                                        question={q}
                                                        globalLang={globalLang}
                                                        globalGender={globalGender}
                                                    />
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}

                            {filteredQuestions.length === 0 && (
                                <div className="text-center py-12 bg-white rounded-2xl border border-gray-200 border-dashed">
                                    <p className="text-gray-500">No questions match the selected filter.</p>
                                </div>
                            )}
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
};

export default UniversityExamResultPage;
