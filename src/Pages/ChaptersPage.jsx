import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import {
    fetchChaptersBySubject,
    fetchTopicsByChapter,
    fetchChapterNotes,
    selectChapters,
    selectTopicsForChapter,
    selectChapterNotes,
    selectChaptersLoading,
} from '../redux/slices/chaptersSlice';
import { selectUser } from '../redux/slices/authSlice';
import { selectUserProfile, fetchUserDetails } from '../redux/slices/userSlice';
import PDFViewerModal from '../Components/PDFViewerModal';
import ChapterQuizModal from '../Components/ChapterQuizModal';
import UpgradePrompt from '../Components/UpgradePrompt';
import QuizAttemptsCounter from '../Components/QuizAttemptsCounter';
import { canAttemptQuiz, getUsedQuizAttempts, hasExceededQuizLimit, getNoteType } from '../utils/accessControl';
import { FiBookOpen, FiFileText, FiChevronDown, FiArrowRight, FiTarget, FiCheckCircle, FiXCircle } from 'react-icons/fi';
import { FaRegFilePdf } from 'react-icons/fa6';
import { MdQuiz } from 'react-icons/md';
import { HiOutlineDocumentText } from 'react-icons/hi';

function ChaptersPage() {
    const { subjectId } = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();

    // Potentially passed from previous page
    const courseId = location.state?.courseId || '029ec354-81bf-460e-a444-a04051a3b13d'; // Default or from params

    const chapters = useSelector(selectChapters);
    const loading = useSelector(selectChaptersLoading);
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

    const [activeTab, setActiveTab] = useState('quizzes'); // 'notes' or 'quizzes'
    const [expandedChapters, setExpandedChapters] = useState({});
    const [selectedChapters, setSelectedChapters] = useState([]);

    // PDF Viewer State
    const [showPdfModal, setShowPdfModal] = useState(false);
    const [selectedPdf, setSelectedPdf] = useState(null);

    // Upgrade Prompt State
    const [showUpgradePrompt, setShowUpgradePrompt] = useState(false);

    useEffect(() => {
        if (subjectId) {
            dispatch(fetchChaptersBySubject(subjectId));
        }
    }, [dispatch, subjectId]);

    const handleSelectChapter = (chapterId) => {
        setSelectedChapters(prev =>
            prev.includes(chapterId)
                ? prev.filter(id => id !== chapterId)
                : [...prev, chapterId]
        );
    };

    const toggleChapter = (chapterId) => {
        const isExpanding = !expandedChapters[chapterId];

        setExpandedChapters(prev => ({
            ...prev,
            [chapterId]: isExpanding
        }));

        // Fetch content only if we are expanding
        if (isExpanding) {
            if (activeTab === 'notes') {
                const noteType = getNoteType(user, courseId);
                dispatch(fetchChapterNotes({ courseId, chapterId, noteType }));
            } else {
                // Fetch topics for quizzes tab
                dispatch(fetchTopicsByChapter(chapterId));
            }
        }
    };

    // When tab changes, if any section is open, we might need to fetch data for it
    useEffect(() => {
        Object.keys(expandedChapters).forEach(chapterId => {
            if (expandedChapters[chapterId]) {
                if (activeTab === 'notes') {
                    const noteType = getNoteType(activeUser, courseId);
                    dispatch(fetchChapterNotes({ courseId, chapterId, noteType }));
                } else {
                    dispatch(fetchTopicsByChapter(chapterId));
                }
            }
        });
    }, [activeTab, dispatch, courseId, activeUser]);

    const handleOpenPdf = (note) => {
        const url = note.file_url || note.pdf_url || note.url;
        setSelectedPdf({ url: url, title: note.title || note.name || 'Document' });
        setShowPdfModal(true);
    };

    // Check quiz access before navigation
    const handleQuizNavigation = (path) => {
        // Check if user can attempt quiz
        if (!canAttemptQuiz(activeUser, courseId)) {
            setShowUpgradePrompt(true);
            return false;
        }
        navigate(path);
        return true;
    };

    if (loading && chapters.length === 0) {
        return (
            <div className="min-h-screen flex items-center justify-center pt-32">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 pt-20 sm:pt-32 pb-12">
            <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">

                {/* Header */}
                <div className="mb-6 sm:mb-8 flex md:items-center justify-between flex-col md:flex-row gap-3 sm:gap-4">
                    <div>
                        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Study Content</h1>
                        <p className="text-gray-600 mt-1 sm:mt-2 text-sm sm:text-base">Access notes and question bank for this subject</p>
                    </div>

                    {/* Quiz Attempts Counter for Free Users */}
                    {activeUser && !activeUser.has_active_subscription && (
                        <div className="w-full md:w-80">
                            <QuizAttemptsCounter
                                used={getUsedQuizAttempts(activeUser)}
                                total={2}
                            />
                        </div>
                    )}
                </div>

                {/* Tabs */}
                <div className="flex gap-4 sm:gap-6 mb-6 sm:mb-8 border-b border-gray-200 overflow-x-auto">
                    <button
                        onClick={() => setActiveTab('quizzes')}
                        className={`pb-3 px-1 sm:px-2 font-bold text-sm sm:text-lg cursor-pointer transition-all relative flex items-center gap-1.5 sm:gap-2 whitespace-nowrap ${activeTab === 'quizzes'
                            ? 'text-orange-500'
                            : 'text-gray-400 hover:text-gray-600'
                            }`}
                    >
                        <FiBookOpen className={`w-4 h-4 sm:w-5 sm:h-5 transition-colors ${activeTab === 'quizzes' ? 'text-orange-500' : 'text-gray-400'}`} />
                        Question Bank
                        {activeTab === 'quizzes' && (
                            <span className="absolute bottom-0 left-0 w-full h-1 bg-orange-600 rounded-t-full"></span>
                        )}
                    </button>
                    <button
                        onClick={() => setActiveTab('notes')}
                        className={`pb-3 px-1 sm:px-2 font-bold text-sm sm:text-lg cursor-pointer transition-all relative flex items-center gap-1.5 sm:gap-2 whitespace-nowrap ${activeTab === 'notes'
                            ? 'text-orange-500'
                            : 'text-gray-400 hover:text-gray-600'
                            }`}
                    >
                        <FiFileText className={`w-4 h-4 sm:w-5 sm:h-5 transition-colors ${activeTab === 'notes' ? 'text-orange-500' : 'text-gray-400'}`} />
                        Study Notes
                        {activeTab === 'notes' && (
                            <span className="absolute bottom-0 left-0 w-full h-1 bg-orange-600 rounded-t-full"></span>
                        )}
                    </button>
                </div>

                {/* Content Area */}
                <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm border border-gray-100 p-3 sm:p-6 min-h-[300px] sm:min-h-[400px]">
                    {chapters.length === 0 ? (
                        <div className="text-center py-20">
                            <p className="text-gray-500 text-lg">No chapters available for this subject yet.</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {chapters.map(chapter => (
                                <ChapterAccordion
                                    key={chapter.id}
                                    chapter={chapter}
                                    activeTab={activeTab}
                                    isOpen={!!expandedChapters[chapter.id]}
                                    onToggle={() => toggleChapter(chapter.id)}
                                    isSelected={selectedChapters.includes(chapter.id)}
                                    onSelect={() => handleSelectChapter(chapter.id)}
                                    onOpenPdf={handleOpenPdf}
                                    onQuizNavigate={handleQuizNavigation}
                                    courseId={courseId}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>

            <PDFViewerModal
                isOpen={showPdfModal}
                onClose={() => setShowPdfModal(false)}
                pdfUrl={selectedPdf?.url}
                title={selectedPdf?.title}
            />

            {/* Floating Bulk Quiz Bar */}
            {selectedChapters.length > 0 && activeTab === 'quizzes' && (
                <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-[0_-4px_10px_rgba(0,0,0,0.05)] p-3 sm:p-4 z-50 transform transition-transform duration-300 translate-y-0">
                    <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 px-3 sm:px-6 lg:px-8">
                        <div className="text-center sm:text-left">
                            <span className="font-bold text-base sm:text-lg text-gray-900">{selectedChapters.length}</span>
                            <span className="text-gray-600 ml-2 text-sm sm:text-base">Chapter{selectedChapters.length > 1 ? 's' : ''} Selected</span>
                        </div>
                        <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto">
                            <button
                                onClick={() => setSelectedChapters([])}
                                className="flex-1 sm:flex-initial px-3 sm:px-4 py-2 text-gray-500 font-semibold cursor-pointer hover:text-gray-800 transition text-sm sm:text-base"
                            >
                                Clear All
                            </button>
                            <button
                                onClick={() => handleQuizNavigation(`/quiz/start?multiChapterIds=${selectedChapters.join(',')}`)}
                                className="flex-1 sm:flex-initial px-4 sm:px-6 py-2.5 sm:py-3 bg-orange-600 text-white font-bold rounded-xl cursor-pointer shadow-lg hover:bg-orange-700 hover:shadow-xl transition-all hover:scale-105 flex items-center justify-center gap-2 text-sm sm:text-base"
                            >
                                ⚡ Start Bulk Test
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Upgrade Prompt Modal */}
            <UpgradePrompt
                isOpen={showUpgradePrompt}
                onClose={() => setShowUpgradePrompt(false)}
                feature="quiz"
                user={activeUser}
                courseId={courseId}
            />
        </div>
    );
}

// Sub-component for Accordion Item
function ChapterAccordion({ chapter, activeTab, isOpen, onToggle, isSelected, onSelect, onOpenPdf, onQuizNavigate, courseId }) {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const notesData = useSelector(selectChapterNotes(chapter.id));
    const topicsData = useSelector(selectTopicsForChapter(chapter.id));
    const chapterTopics = topicsData.topics;

    const [isChapterQuizModalOpen, setChapterQuizModalOpen] = useState(false);

    // Extract stats from chapter data
    const stats = chapter.stats || {};
    const totalQ = stats.total || 0;
    const attempted = (stats.easy?.attempted || 0) + (stats.moderate?.attempted || 0) + (stats.difficult?.attempted || 0);
    const unattempted = totalQ - attempted;
    const attemptPercent = totalQ > 0 ? Math.round((attempted / totalQ) * 100) : 0;

    return (
        <div className={`border rounded-xl overflow-hidden transition-all duration-300 bg-white ${isOpen ? 'border-orange-200 shadow-lg shadow-orange-100/50' : 'border-gray-100 hover:shadow-md'}`}>
            {/* --- HEADER ROW --- */}
            <div className={`w-full flex items-center justify-between p-3 sm:p-5 transition-colors ${isOpen ? 'bg-orange-50/50' : 'bg-white hover:bg-gray-50'}`}>
                <div className="flex items-center gap-2 sm:gap-4 cursor-pointer flex-1 min-w-0" onClick={onToggle}>
                    {activeTab === 'quizzes' && (
                        <div
                            className="mr-1 flex items-center cursor-pointer shrink-0"
                            onClick={(e) => {
                                e.stopPropagation();
                                onSelect();
                            }}
                        >
                            <input
                                type="checkbox"
                                checked={isSelected}
                                onChange={() => { }}
                                className="w-5 h-5 text-orange-600 rounded border-gray-300 focus:ring-orange-500 cursor-pointer"
                            />
                        </div>
                    )}
                    <span className={`p-2 sm:p-2.5 rounded-lg sm:rounded-xl shrink-0 ${activeTab === 'notes' ? 'bg-orange-50 text-orange-600' : 'bg-orange-50 text-orange-600'}`}>
                        {activeTab === 'notes' ? <FiFileText className="w-4 h-4 sm:w-5 sm:h-5" /> : <FiBookOpen className="w-4 h-4 sm:w-5 sm:h-5" />}
                    </span>
                    <div className="min-w-0 flex-1">
                        <h3 className={`font-bold text-sm sm:text-base md:text-lg truncate ${isOpen ? 'text-orange-900' : 'text-gray-800'}`}>{chapter.name}</h3>
                        {/* Inline Stats Summary (visible when collapsed) */}
                        {totalQ > 0 && !isOpen && activeTab === 'quizzes' && (
                            <div className="flex items-center gap-3 mt-1.5 flex-wrap">
                                <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
                                    <HiOutlineDocumentText className="w-3 h-3" /> {totalQ} Qs
                                </span>
                                {attempted > 0 && (
                                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-green-700 bg-green-50 px-2 py-0.5 rounded-full">
                                        <FiCheckCircle className="w-3 h-3" /> {attempted}
                                    </span>
                                )}
                                {unattempted > 0 && (
                                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-orange-600 bg-orange-50 px-2 py-0.5 rounded-full">
                                        <FiXCircle className="w-3 h-3" /> {unattempted}
                                    </span>
                                )}
                                {/* Mini progress bar */}
                                <div className="hidden sm:flex items-center gap-1.5">
                                    <div className="w-20 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                                        <div className="h-full bg-green-500 rounded-full transition-all duration-500" style={{ width: `${attemptPercent}%` }}></div>
                                    </div>
                                    <span className="text-[10px] font-bold text-gray-400">{attemptPercent}%</span>
                                </div>
                            </div>
                        )}
                        {totalQ === 0 && !isOpen && (
                            <p className="text-gray-400 text-xs mt-1">{chapter.description || 'View content'}</p>
                        )}
                    </div>
                </div>
                <div onClick={onToggle} className={`cursor-pointer w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center shrink-0 transition-all duration-300 ${isOpen ? 'bg-orange-200 rotate-180 text-orange-700' : 'bg-gray-100 text-gray-500'}`}>
                    <FiChevronDown className="w-4 h-4 sm:w-5 sm:h-5" />
                </div>
            </div>

            {/* --- EXPANDED CONTENT --- */}
            <div className={`transition-all duration-300 ease-in-out border-t border-dashed border-gray-200 ${isOpen ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0 overflow-hidden'}`}>
                <div className="p-3 sm:p-6 bg-white">

                    {/* ========= STATS PANEL (always visible when expanded & has stats & active tab is quizzes) ========= */}
                    {totalQ > 0 && activeTab === 'quizzes' && (
                        <div className="mb-4 sm:mb-6 bg-gradient-to-br from-slate-50 to-gray-50 rounded-xl sm:rounded-2xl border border-gray-200/80 p-3 sm:p-5 shadow-sm">
                            {/* Top row: Total, Attempted, Unattempted */}
                            <div className="grid grid-cols-3 gap-2 sm:gap-4 mb-4 sm:mb-5">
                                <div className="text-center p-2 sm:p-3 bg-white rounded-lg sm:rounded-xl border border-gray-100 shadow-sm">
                                    <div className="text-lg sm:text-2xl font-black text-gray-800">{totalQ}</div>
                                    <div className="text-[8px] sm:text-[10px] uppercase tracking-widest font-bold text-gray-400 mt-0.5">Total</div>
                                </div>
                                <div className="text-center p-2 sm:p-3 bg-green-50 rounded-lg sm:rounded-xl border border-green-100 shadow-sm">
                                    <div className="text-lg sm:text-2xl font-black text-green-600">{attempted}</div>
                                    <div className="text-[8px] sm:text-[10px] uppercase tracking-widest font-bold text-green-500 mt-0.5">Attempted</div>
                                </div>
                                <div className="text-center p-2 sm:p-3 bg-orange-50 rounded-lg sm:rounded-xl border border-orange-100 shadow-sm">
                                    <div className="text-lg sm:text-2xl font-black text-orange-600">{unattempted}</div>
                                    <div className="text-[8px] sm:text-[10px] uppercase tracking-widest font-bold text-orange-400 mt-0.5">Unattempted</div>
                                </div>
                            </div>

                            {/* Progress bar */}
                            <div className="mb-5">
                                <div className="flex justify-between items-center mb-1.5">
                                    <span className="text-xs font-bold text-gray-500">Completion</span>
                                    <span className="text-xs font-black text-gray-700">{attemptPercent}%</span>
                                </div>
                                <div className="w-full h-2.5 bg-gray-200 rounded-full overflow-hidden">
                                    <div
                                        className={`h-full rounded-full transition-all duration-700 ease-out ${attemptPercent >= 70 ? 'bg-gradient-to-r from-green-400 to-orange-500' : attemptPercent >= 30 ? 'bg-gradient-to-r from-yellow-400 to-orange-400' : 'bg-gradient-to-r from-orange-400 to-red-400'}`}
                                        style={{ width: `${attemptPercent}%` }}
                                    ></div>
                                </div>
                            </div>

                            {/* Bottom row: Easy / Moderate / Difficult breakdown */}
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-3">
                                {/* Easy */}
                                <div className="relative overflow-hidden rounded-lg sm:rounded-xl border border-orange-100 bg-white p-2.5 sm:p-3">
                                    <div className="absolute top-0 left-0 w-1 h-full bg-orange-400 rounded-r"></div>
                                    <div className="pl-2 flex sm:block items-center justify-between">
                                        <div>
                                            <div className="text-[9px] sm:text-[10px] uppercase tracking-widest font-bold text-orange-500 mb-0.5 sm:mb-1">Easy</div>
                                            <div className="flex items-baseline gap-1">
                                                <span className="text-base sm:text-xl font-black text-gray-800">{stats.easy?.total || 0}</span>
                                                <span className="text-[9px] sm:text-[10px] text-gray-400">total</span>
                                            </div>
                                        </div>
                                        <div className="flex gap-2 sm:mt-1.5 text-[9px] sm:text-[10px] font-semibold">
                                            <span className="text-green-600">{stats.easy?.attempted || 0} done</span>
                                            <span className="text-gray-400">•</span>
                                            <span className="text-orange-500">{stats.easy?.unattempted || 0} left</span>
                                        </div>
                                    </div>
                                </div>
                                {/* Moderate */}
                                <div className="relative overflow-hidden rounded-lg sm:rounded-xl border border-orange-100 bg-white p-2.5 sm:p-3">
                                    <div className="absolute top-0 left-0 w-1 h-full bg-orange-400 rounded-r"></div>
                                    <div className="pl-2 flex sm:block items-center justify-between">
                                        <div>
                                            <div className="text-[9px] sm:text-[10px] uppercase tracking-widest font-bold text-orange-500 mb-0.5 sm:mb-1">Moderate</div>
                                            <div className="flex items-baseline gap-1">
                                                <span className="text-base sm:text-xl font-black text-gray-800">{stats.moderate?.total || 0}</span>
                                                <span className="text-[9px] sm:text-[10px] text-gray-400">total</span>
                                            </div>
                                        </div>
                                        <div className="flex gap-2 sm:mt-1.5 text-[9px] sm:text-[10px] font-semibold">
                                            <span className="text-green-600">{stats.moderate?.attempted || 0} done</span>
                                            <span className="text-gray-400">•</span>
                                            <span className="text-orange-500">{stats.moderate?.unattempted || 0} left</span>
                                        </div>
                                    </div>
                                </div>
                                {/* Difficult */}
                                <div className="relative overflow-hidden rounded-lg sm:rounded-xl border border-red-100 bg-white p-2.5 sm:p-3">
                                    <div className="absolute top-0 left-0 w-1 h-full bg-red-400 rounded-r"></div>
                                    <div className="pl-2 flex sm:block items-center justify-between">
                                        <div>
                                            <div className="text-[9px] sm:text-[10px] uppercase tracking-widest font-bold text-red-500 mb-0.5 sm:mb-1">Difficult</div>
                                            <div className="flex items-baseline gap-1">
                                                <span className="text-base sm:text-xl font-black text-gray-800">{stats.difficult?.total || 0}</span>
                                                <span className="text-[9px] sm:text-[10px] text-gray-400">total</span>
                                            </div>
                                        </div>
                                        <div className="flex gap-2 sm:mt-1.5 text-[9px] sm:text-[10px] font-semibold">
                                            <span className="text-green-600">{stats.difficult?.attempted || 0} done</span>
                                            <span className="text-gray-400">•</span>
                                            <span className="text-orange-500">{stats.difficult?.unattempted || 0} left</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* NOTES VIEW */}
                    {activeTab === 'notes' && (
                        <div>
                            {notesData.loading ? (
                                <div className="flex justify-center py-4"><div className="animate-spin rounded-full h-6 w-6 border-b-2 border-orange-500"></div></div>
                            ) : notesData.notes && notesData.notes.length > 0 ? (
                                <div className="grid gap-3">
                                    {notesData.notes.map((note, idx) => (
                                        <div key={idx} className="flex items-center justify-between p-3 sm:p-4 bg-gray-50 rounded-lg sm:rounded-xl hover:bg-orange-50 border border-gray-100 hover:border-orange-200 transition-all group gap-2">
                                            <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                                                <div className="bg-white p-1.5 sm:p-2 rounded shadow-sm text-red-500 shrink-0">
                                                    <FaRegFilePdf className="w-5 h-5 sm:w-6 sm:h-6" />
                                                </div>
                                                <div className="min-w-0">
                                                    <h4 className="font-bold text-sm sm:text-base text-gray-800 group-hover:text-orange-700 transition-colors truncate">{note.title}</h4>
                                                    <p className="text-[10px] sm:text-xs text-gray-500 truncate">{note.description || 'PDF Document'}</p>
                                                </div>
                                            </div>
                                            <button
                                                onClick={() => onOpenPdf(note)}
                                                className="px-3 sm:px-4 py-1.5 sm:py-2 bg-white border border-gray-200 cursor-pointer rounded-lg text-xs sm:text-sm font-semibold text-gray-600 hover:bg-orange-500 hover:text-white hover:border-orange-500 transition-all shadow-sm shrink-0"
                                            >
                                                View
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-8 bg-gray-50 rounded-xl border border-dashed border-gray-300">
                                    <p className="text-gray-500 italic">No notes available for this chapter.</p>
                                </div>
                            )}
                        </div>
                    )}

                    {/* QUIZZES / TOPICS VIEW */}
                    {activeTab === 'quizzes' && (
                        <div>
                            <div className={`flex ${chapterTopics.length > 0 ? 'flex-col sm:flex-row sm:justify-between gap-3' : 'justify-center'} items-center mb-4 sm:mb-6 py-2`}>
                                {chapterTopics.length > 0 && (
                                    <p className="text-xs sm:text-sm font-bold text-gray-400 uppercase tracking-widest">Available Topics</p>
                                )}
                                <button
                                    onClick={() => setChapterQuizModalOpen(true)}
                                    className={`flex items-center gap-2 group cursor-pointer transition-all duration-300 ${chapterTopics.length > 0
                                        ? 'px-3 sm:px-4 py-2 bg-orange-100 text-orange-700 hover:bg-orange-500 hover:text-white'
                                        : 'px-6 sm:px-8 py-3 sm:py-4 bg-orange-500 text-white hover:bg-orange-600 sm:scale-110 shadow-lg hover:shadow-orange-200'
                                        } rounded-xl font-bold text-sm md:text-base`}
                                >
                                    <span className={`text-base sm:text-lg transition-transform group-hover:rotate-12 ${chapterTopics.length === 0 ? 'sm:text-2xl' : ''}`}>⚡</span>
                                    {chapterTopics.length > 0 ? 'Chapter Test' : 'Take Chapter Test'}
                                </button>
                            </div>

                            {chapterTopics.length > 0 && (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                    {chapterTopics.map((topic) => (
                                        <div
                                            key={topic.id}
                                            className="p-3 sm:p-4 border border-gray-100 rounded-lg sm:rounded-xl hover:border-orange-300 hover:shadow-md transition-all cursor-pointer flex justify-between items-center group bg-gray-50/30 gap-2"
                                            onClick={() => onQuizNavigate(`/quiz/start?topicIds=${topic.id}`)}
                                        >
                                            <span className="font-medium text-sm sm:text-base text-gray-700 group-hover:text-orange-700 truncate">{topic.name}</span>
                                            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white border border-gray-100 group-hover:bg-orange-500 group-hover:border-orange-500 flex items-center justify-center text-gray-300 group-hover:text-white transition-all shrink-0">
                                                <FiArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}

                            <ChapterQuizModal
                                isOpen={isChapterQuizModalOpen}
                                onClose={() => setChapterQuizModalOpen(false)}
                                chapter={chapter}
                            />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default ChaptersPage;
