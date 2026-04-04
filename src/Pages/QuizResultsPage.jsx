import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import AudioPlayer from '../Components/AudioPlayer';
import {
    fetchQuizResults,
    fetchAttemptDetails,
    selectQuizResults,
    selectQuizLoading,
    selectQuizError,
    clearQuizResult,
} from '../redux/slices/quizSlice';
import { selectUser } from '../redux/slices/authSlice';
import {
    fetchMockTestResult,
    selectMockTestResult,
    selectCurrentMockTest,
    selectMockTestsLoading,
    selectMockTestsError,
} from '../redux/slices/mockTestsSlice';

const AudioExplanationSection = ({ question, globalLang, globalGender }) => {
    const audioUrls = question.explanation_audio_urls || {};
    const maleUrl = question.male_explanation_audio_url;
    const femaleUrl = question.female_explanation_audio_url;
    
    // Attempt to use globalLang first
    let selectedLangAudio = audioUrls[globalLang];

    // Fallback to english if globalLang is not found in this specific question
    if (!selectedLangAudio && globalLang && globalLang !== 'en') {
        selectedLangAudio = audioUrls['en'] || audioUrls['EN'];
    }

    const isLangObject = selectedLangAudio && typeof selectedLangAudio === 'object';
    
    let currentAudioUrl = null;

    if (selectedLangAudio) {
        if (typeof selectedLangAudio === 'string') {
            currentAudioUrl = selectedLangAudio;
        } else if (isLangObject) {
            currentAudioUrl = globalGender === 'female' 
                ? (selectedLangAudio.female || selectedLangAudio.male) 
                : (selectedLangAudio.male || selectedLangAudio.female);
        }
    } else {
        // Fallback to generic urls
        currentAudioUrl = globalGender === 'female' ? (femaleUrl || maleUrl) : (maleUrl || femaleUrl);
    }

    if (!currentAudioUrl || typeof currentAudioUrl !== 'string' || currentAudioUrl.trim() === '') {
        return (
            <div className="mt-3 sm:mt-4 p-3 bg-orange-50 rounded-lg border border-orange-200 flex items-center gap-2">
                <span className="text-orange-500">⚠️</span>
                <p className="text-xs text-orange-700 font-medium italic">Audio explanation unavailable</p>
            </div>
        );
    }

    return (
        <div className="mt-3 sm:mt-4 p-3 sm:p-4 bg-white/50 rounded-lg sm:rounded-xl border border-orange-100 shadow-sm">
            <div className="flex items-center gap-2 mb-2 sm:mb-3">
                <span className="text-lg sm:text-xl">🎧</span>
                <p className="text-xs sm:text-sm font-bold text-orange-900 uppercase tracking-wider">Audio Explanation</p>
            </div>
            <AudioPlayer audioUrl={currentAudioUrl} autoPlay={false} />
        </div>
    );
};

function QuizResultsPage() {
    const { quizId } = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();

    const reduxResults = useSelector(selectQuizResults);
    const attemptDetails = useSelector((state) => state.quiz.attemptDetails);
    const quizLoading = useSelector(selectQuizLoading);
    const quizError = useSelector(selectQuizError);

    const mockTestResult = useSelector(selectMockTestResult);
    const currentMockTest = useSelector(selectCurrentMockTest);
    const mockTestLoading = useSelector(selectMockTestsLoading);
    const mockTestError = useSelector(selectMockTestsError);

    const [localResults, setLocalResults] = useState(null);

    // Global Audio Configuration State
    const [globalLang, setGlobalLang] = useState('en');
    const [globalGender, setGlobalGender] = useState('male');

    const isMockTest = quizId && quizId.includes('-mock-test');
    // For mock tests, the quizId parameter IS the attempt_id (based on how we navigate in QuizTakingPage)
    // or if the URL construction is different, we parse it. 
    // In QuizTakingPage: navigate(`/quiz/results/${testId}-mock-test`); 
    // And testId was result.test_id || ... || attemptId.
    // Let's assume the ID in the URL is the one we need to fetch results for.
    // If the identifying ID for result fetching is attempt_id, then we should ensure we are extracting it.

    // However, looking at the slice update, we need `attempt_id`.
    // Let's assume the ID extracted from URL is the attempt_id.
    const testIdFromUrl = isMockTest ? quizId.replace('-mock-test', '') : null;
    const attemptIdFromState = location.state?.attemptId;
    const user = useSelector(selectUser);

    

    

    useEffect(() => {
        if (quizId === 'direct') {
            // Load results from localStorage for direct quizzes
            const storedResults = localStorage.getItem('quiz_results_direct');

            if (storedResults) {
                try {
                    const parsedResults = JSON.parse(storedResults);
                    setLocalResults(parsedResults);
                } catch (error) {
                    console.error('Failed to parse stored quiz results:', error);
                }
            }
        } else if (isMockTest && testIdFromUrl) {
            // Fetch mock test results
            const userId = user?.user_id || user?.id || user?.uuid;
            if (userId) {
                dispatch(fetchMockTestResult({

                    attempt_id: testIdFromUrl,
                    user_id: userId
                }));
            }
        } else if (quizId) {
            const userId = user?.user_id || user?.id || user?.uuid;
            dispatch(fetchAttemptDetails({ attempt_id: quizId, user_id: userId }));
        }
    }, [dispatch, quizId, isMockTest, testIdFromUrl, attemptIdFromState, user]);

    // Use appropriate results based on type
    const results = quizId === 'direct' ? localResults : (isMockTest ? mockTestResult : (attemptDetails || reduxResults));
    const loading = isMockTest ? mockTestLoading : (quizId === 'direct' ? false : quizLoading);
    const error = isMockTest ? mockTestError : (quizId === 'direct' ? null : quizError);

    // Helper to extract stats safely from various response structures
    const getStats = (data) => {
        if (!data) return {};

        // Check for results.attempt (New Details API standard)
        if (data.attempt) {
            const att = data.attempt;
            return {
                total_questions: att.total_questions || 0,
                correct_answers: att.correct_answers || 0,
                wrong_answers: (att.total_questions || 0) - (att.correct_answers || 0),
                score: att.score || 0,
                percentage: att.score || 0,
                time_taken: att.time_taken_seconds || att.time_taken || 0
            };
        }

        // Check for results.result.analysis (Mock Test API standard)
        if (data.result?.analysis) {
            const analysis = { ...data.result.analysis };
            if (analysis.wrong_answers === undefined && analysis.incorrect_answers !== undefined) {
                analysis.wrong_answers = analysis.incorrect_answers;
            }
            if (analysis.percentage === undefined && analysis.score !== undefined) {
                analysis.percentage = analysis.score;
            }
            return analysis;
        }
        // Check for data.analysis
        if (data.analysis) {
            const analysis = { ...data.analysis };
            if (analysis.wrong_answers === undefined && analysis.incorrect_answers !== undefined) {
                analysis.wrong_answers = analysis.incorrect_answers;
            }
            if (analysis.percentage === undefined && analysis.score !== undefined) {
                analysis.percentage = analysis.score;
            }
            return analysis;
        }
        
        // Check for correct/total/score (AMC API standard)
        if (data.total !== undefined) {
             const stats = {
                 score: data.score || 0,
                 correct_answers: data.correct || 0,
                 wrong_answers: (data.total || 0) - (data.correct || 0),
                 total_questions: data.total || 0,
                 percentage: data.score || 0
             };
             return stats;
        }
        // Check for specific AMC fields in the direct response
        if (data?.total_questions !== undefined) {
            return {
                total_questions: data.total_questions,
                correct_answers: data.correct_answers !== undefined ? data.correct_answers : (data.correct || 0),
                wrong_answers: data.wrong_answers !== undefined ? data.wrong_answers : (data.incorrect_answers || (data.total_questions - (data.correct || 0))),
                score: data.score || 0,
                percentage: data.percentage !== undefined ? data.percentage : (data.score || 0),
                time_taken: data.time_taken !== undefined ? data.time_taken : (data.time_spent || 0)
            };
        }

        // Check for flat structure (Redux/Local standard)
        const stats = { ...data };
        if (stats.wrong_answers === undefined && stats.incorrect_answers !== undefined) {
            stats.wrong_answers = stats.incorrect_answers;
        }

        if (stats.percentage === undefined && stats.score !== undefined) {
            stats.percentage = stats.score;
        }
        return stats;
    };
    const {
        score = 0,
        correct_answers = 0,
        wrong_answers = 0,
        total_questions = 0,
        percentage = 0
    } = getStats(results);

    const getScoreColor = (percentage) => {
        if (percentage >= 80) return 'text-green-600';
        if (percentage >= 60) return 'text-orange-600';
        if (percentage >= 40) return 'text-yellow-600';
        return 'text-red-600';
    };

    const getScoreMessage = (percentage) => {
        if (percentage >= 80) return 'Excellent! 🎉';
        if (percentage >= 60) return 'Good Job! 👍';
        if (percentage >= 40) return 'Keep Practicing! 💪';
        return 'Need More Practice 📚';
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 pt-32">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading results...</p>
                </div>
            </div>
        );
    }

    if (error || !results) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 pt-32">
                <div className="text-center max-w-md">
                    <svg className="w-16 h-16 text-red-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Results Not Found</h2>
                    <p className="text-gray-600 mb-6">{error || 'Unable to load test results'}</p>
                    <button
                        onClick={() => navigate('/quiz/history')}
                        className="px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition"
                    >
                        View Test History
                    </button>
                </div>
            </div>
        );
    }

    // Use extracted stats instead of manually calculating or accessing results directly
    // const percentage = ... (Removd duplicate declaration)

    // Handle both 'review' and 'questions' array formats from different API endpoints
    // Check results.result.questions / details as well
    const reviewQuestions = results?.attempt?.review || results?.review || results?.questions || results?.results || results?.data?.questions || results?.data || results?.result?.details || results?.details || results?.result?.questions || [];
    //     const reviewQuestions = Array.isArray(results?.review)
    //   ? results.review
    //   : Array.isArray(results?.questions)
    //   ? results.questions
    //   : Array.isArray(results?.result?.details)
    //   ? results.result.details
    //   : Array.isArray(results?.details)
    //   ? results.details
    //   : [];

    const availableLanguages = React.useMemo(() => {
        if (!reviewQuestions) return [];
        const langs = new Set();
        reviewQuestions.forEach(item => {
            const q = item.question || item;
            if (q.explanation_audio_urls) {
                Object.keys(q.explanation_audio_urls).forEach(l => langs.add(l));
            }
        });
        const langsArray = Array.from(langs);
        if (langsArray.length === 0) langsArray.push('en');
        return langsArray;
    }, [reviewQuestions]);


    return (
        <div className="min-h-screen bg-gray-50 pt-20 sm:pt-32 pb-8 sm:pb-12">
            <div className="max-w-4xl mx-auto px-3 sm:px-6 lg:px-8">
                {/* Score Card */}
                <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-8 mb-6 sm:mb-8 text-center">
                    <h1 className="text-xl sm:text-3xl font-bold text-gray-900 mb-1 sm:mb-2">Test Results</h1>
                    <p className="text-gray-600 text-sm sm:text-base mb-4 sm:mb-6 truncate">{results.quiz_title || results.result?.test_title || 'Test Completed'}</p>

                    <div className={`text-4xl sm:text-6xl font-bold mb-2 sm:mb-4 ${getScoreColor(percentage)}`}>
                        {percentage}%
                    </div>

                    <p className="text-lg sm:text-2xl font-semibold text-gray-700 mb-4 sm:mb-6">
                        {getScoreMessage(percentage)}
                    </p>

                    <div className="grid grid-cols-3 gap-2 sm:gap-4 max-w-2xl mx-auto">
                        <div className="bg-orange-50 rounded-lg sm:rounded-xl p-2.5 sm:p-4">
                            <div className="text-xl sm:text-3xl font-bold text-orange-600">{total_questions}</div>
                            <div className="text-[10px] sm:text-sm text-gray-600 mt-0.5 sm:mt-1">Total</div>
                        </div>
                        <div className="bg-green-50 rounded-lg sm:rounded-xl p-2.5 sm:p-4">
                            <div className="text-xl sm:text-3xl font-bold text-green-600">{correct_answers}</div>
                            <div className="text-[10px] sm:text-sm text-gray-600 mt-0.5 sm:mt-1">Correct</div>
                        </div>
                        <div className="bg-red-50 rounded-lg sm:rounded-xl p-2.5 sm:p-4">
                            <div className="text-xl sm:text-3xl font-bold text-red-600">{wrong_answers}</div>
                            <div className="text-[10px] sm:text-sm text-gray-600 mt-0.5 sm:mt-1">Incorrect</div>
                        </div>
                    </div>
                    {!!results.time_taken && (
                        <div className="mt-4 sm:mt-6 text-gray-600 text-sm sm:text-base">
                            <span className="font-semibold">Time Taken:</span> {results?.result?.time_taken || results?.time_taken}
                        </div>
                    )}
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 justify-center mb-6 sm:mb-8">
                    <button
                        onClick={() => navigate('/courses/amc')}
                        className="px-5 sm:px-6 py-2.5 sm:py-3 bg-orange-500 text-white rounded-xl sm:rounded-lg hover:bg-orange-600 transition font-semibold text-sm sm:text-base cursor-pointer"
                    >
                        Take Another Test
                    </button>
                    <button
                        onClick={() => navigate('/quiz/history')}
                        className="px-5 sm:px-6 py-2.5 sm:py-3 bg-gray-200 text-gray-700 rounded-xl sm:rounded-lg hover:bg-gray-300 transition font-semibold text-sm sm:text-base cursor-pointer"
                    >
                        View History
                    </button>
                </div>

                {/* Detailed Results */}
                {reviewQuestions && reviewQuestions.length > 0 && (
                    <div className="bg-white rounded-xl shadow-md p-3 sm:p-6">
                    <h2 className="text-lg sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6">Detailed Review</h2>

                    {/* Global Audio Configuration Bar */}
                    <div className="bg-orange-50/80 border border-orange-200 rounded-xl p-4 mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                            <span className="text-2xl">🎧</span>
                            <div>
                                <h3 className="font-bold text-orange-900 text-sm">Global Audio Settings</h3>
                                <p className="text-xs text-orange-700">These settings will apply to all explanations</p>
                            </div>
                        </div>

                        <div className="flex flex-col min-[450px]:flex-row items-stretch min-[450px]:items-center gap-3 w-full sm:w-auto">
                            {/* Language Picker */}
                            <div className="flex-1 sm:flex-none flex items-center justify-between min-[450px]:justify-start gap-2 bg-white rounded-lg px-3 py-2 border border-orange-200 shadow-sm">
                                <span className="text-xs font-bold text-orange-700 uppercase">Lang:</span>
                                <select 
                                    value={globalLang} 
                                    onChange={(e) => setGlobalLang(e.target.value)}
                                    className="text-xs font-bold bg-transparent border-none focus:ring-0 cursor-pointer text-orange-900 p-0 w-full"
                                >
                                    {availableLanguages.map(lang => (
                                        <option key={lang} value={lang}>
                                            {lang.toUpperCase()}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Gender Toggle */}
                            <div className="flex bg-white rounded-lg p-1 border border-orange-200 shadow-sm shrink-0">
                                {['male', 'female'].map((g) => (
                                    <button
                                        key={g}
                                        onClick={() => setGlobalGender(g)}
                                        className={`px-3 py-1.5 text-xs font-bold rounded-md transition-all ${
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
                    </div>

                    <div className="space-y-4 sm:space-y-6">
                            {reviewQuestions.map((item, index) => {
                                // Extract question data - could be nested in item.question (New API) or flat (Old API/Local)
                                const question = item.question || item;
                                
                                // Handle both API response formats
                                const isCorrect = item.is_correct !== undefined
                                    ? item.is_correct
                                    : (item.user_answer !== undefined && question.correct_answer !== undefined && 
                                       (String(item.user_answer) === String(question.correct_answer) || 
                                       (item.selected_key && String(item.selected_key).toLowerCase() === String(question.correct_key || question.correct_answer).toLowerCase())));

                                return (
                                    <div
                                        key={index}
                                        className={`border-2 rounded-xl sm:rounded-lg p-3 sm:p-6 ${isCorrect ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'
                                            }`}
                                    >
                                        <div className="flex items-center justify-between gap-2 mb-3 pb-3 border-b border-gray-200 border-opacity-50">
                                            <span className="font-bold text-gray-500 text-xs sm:text-sm uppercase tracking-wider">
                                                Question {index + 1}
                                            </span>
                                            <span className={`px-2 sm:px-3 py-0.5 sm:py-1 rounded-md text-[10px] sm:text-sm font-bold whitespace-nowrap shrink-0 shadow-sm ${isCorrect ? 'bg-green-100 text-green-700 border border-green-200' : 'bg-red-100 text-red-700 border border-red-200'
                                                }`}>
                                                {isCorrect ? '✓ CORRECT' : '✗ WRONG'}
                                            </span>
                                        </div>
                                        <h3 className="text-sm sm:text-lg font-semibold text-gray-900 break-words whitespace-pre-wrap leading-relaxed mb-4 sm:mb-5">
                                            {question.question_text || question.question || (typeof question.text === 'string' ? question.text : (question.text?.content || question.content || 'Question Text Missing'))}
                                        </h3>

                                        {/* Supplemental Question Image */}
                                        {(question.image_url || question.question_image_url) && (
                                            <div className="mb-4 bg-white/60 rounded-xl p-2 sm:p-4 flex justify-center w-full shadow-sm border border-gray-100">
                                                <img 
                                                    src={question.image_url || question.question_image_url} 
                                                    alt="Question Visualization" 
                                                    className="max-w-full md:max-w-xl max-h-[250px] object-contain rounded-lg"
                                                    onError={(e) => { e.target.style.display = 'none'; }}
                                                />
                                            </div>
                                        )}

                                        <div className="flex flex-col gap-3 sm:gap-4 mt-3 sm:mt-4">
                                            {/* Options Section */}
                                            <div className="grid gap-1.5 sm:gap-2">
                                                {(question.options || []).map((opt) => {
                                                    const optionKey = typeof opt === 'string' ? opt.charAt(0).toLowerCase() : (opt.option_key || opt.key);
                                                    const optionContent = typeof opt === 'string' ? opt : (opt.content || opt.text);

                                                    // Determine selection state
                                                    const isUserAnswer = (item.selected_key && String(item.selected_key).toLowerCase() === String(optionKey).toLowerCase()) ||
                                                        (item.user_answer && String(item.user_answer).toLowerCase() === String(optionKey).toLowerCase());

                                                    const isCorrectAnswer = (question.correct_key && String(question.correct_key).toLowerCase() === String(optionKey).toLowerCase()) ||
                                                        (question.correct_answer && String(question.correct_answer).toLowerCase() === String(optionKey).toLowerCase());

                                                    return (
                                                        <div
                                                            key={optionKey}
                                                            className={`p-2 sm:p-3 rounded-lg border flex flex-col min-[400px]:flex-row items-start min-[400px]:items-center justify-between gap-2 sm:gap-3 ${isCorrectAnswer
                                                                ? 'bg-green-100 border-green-500'
                                                                : isUserAnswer
                                                                    ? 'bg-red-100 border-red-500'
                                                                    : 'bg-white border-gray-200'
                                                                }`}
                                                        >
                                                            <div className="flex items-start min-[400px]:items-center gap-2 sm:gap-3 min-w-0 w-full mb-0">
                                                                <span className={`w-6 h-6 sm:w-8 sm:h-8 mt-0.5 min-[400px]:mt-0 rounded-full flex items-center justify-center font-bold text-xs sm:text-sm shrink-0 ${isCorrectAnswer ? 'bg-green-500 text-white' : isUserAnswer ? 'bg-red-500 text-white' : 'bg-gray-100 text-gray-500'
                                                                    }`}>
                                                                    {String(optionKey).toUpperCase()}
                                                                </span>
                                                                <span className="text-xs sm:text-base text-gray-800 break-words flex-1 min-w-0 pt-0.5 min-[400px]:pt-0 leading-relaxed">{optionContent}</span>
                                                            </div>

                                                            <div className="flex flex-row min-[400px]:flex-col items-center min-[400px]:items-end justify-end shrink-0 w-full min-[400px]:w-auto border-t min-[400px]:border-t-0 border-gray-100 min-[400px]:border-transparent pt-1.5 min-[400px]:pt-0 mt-0.5 min-[400px]:mt-0 gap-2 min-[400px]:gap-0">
                                                                {isCorrectAnswer && (
                                                                    <span className="text-green-600 font-semibold text-[10px] sm:text-sm">
                                                                        ✓ Correct
                                                                    </span>
                                                                )}
                                                                {isUserAnswer && !isCorrectAnswer && (
                                                                    <span className="text-red-600 font-semibold text-[10px] sm:text-sm">
                                                                        Your Pick
                                                                    </span>
                                                                )}
                                                            </div>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </div>

                                        {(question.explanation || question.explanation_text) && (
                                            <div className="bg-orange-50 border-l-4 border-orange-500 p-3 sm:p-4 rounded mt-3 sm:mt-4">
                                                <p className="text-xs sm:text-sm font-semibold text-orange-900 mb-1">Explanation:</p>
                                                <p className="text-xs sm:text-sm text-orange-800">{question.explanation || question.explanation_text}</p>

                                                <AudioExplanationSection 
                                                    question={question} 
                                                    globalLang={globalLang} 
                                                    globalGender={globalGender} 
                                                />
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default QuizResultsPage;

