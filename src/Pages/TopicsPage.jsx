import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import {
    fetchTopicsByChapter,
    fetchChapterNotes,

    selectTopicsForChapter,
    selectChapterNotes,
    selectChaptersLoading,
} from '../redux/slices/chaptersSlice';
import { selectUser } from '../redux/slices/authSlice';
import PDFViewerModal from '../Components/PDFViewerModal';
import { getNoteType } from '../utils/accessControl';

function TopicsPage() {
    const { chapterId } = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();

    // Course ID from navigation state
    const courseId = location.state?.courseId;

    // Updated selector usage
    const topicsData = useSelector(selectTopicsForChapter(chapterId));
    const topics = topicsData.topics;
    const topicsLoading = topicsData.loading;

    // We can use either the specialized loading or global loading, 
    // but specific loading avoids spinner if another chapter is fetching
    const loading = useSelector(selectChaptersLoading) || topicsLoading;
    const user = useSelector(selectUser);

    // Notes selector
    const { notes, loading: notesLoading, error: notesError } = useSelector(selectChapterNotes(chapterId));

    const [selectedTopics, setSelectedTopics] = useState([]);
    const [activeTab, setActiveTab] = useState(location.state?.activeTab || 'topics'); // 'topics' or 'notes'

    // PDF Viewer State
    const [showPdfModal, setShowPdfModal] = useState(false);
    const [selectedPdf, setSelectedPdf] = useState(null);

    useEffect(() => {
        if (chapterId) {
            dispatch(fetchTopicsByChapter(chapterId));
        }
    }, [dispatch, chapterId]);

    useEffect(() => {
        if (activeTab === 'notes' && chapterId && courseId) {
            const noteType = getNoteType(user, courseId);
            dispatch(fetchChapterNotes({ courseId, chapterId, noteType }));
        }
    }, [dispatch, activeTab, chapterId, courseId, user]);

    const toggleTopic = (topicId) => {
        setSelectedTopics(prev =>
            prev.includes(topicId)
                ? prev.filter(id => id !== topicId)
                : [...prev, topicId]
        );
    };

    const handleStartQuiz = () => {
        if (selectedTopics.length === 0) {
            alert('Please select at least one topic');
            return;
        }
        navigate(`/quiz/start?topicIds=${selectedTopics.join(',')}`);
    };

    const openPdf = (note) => {
        setSelectedPdf({ url: note.file_url, title: note.title });
        setShowPdfModal(true);
    };

    const closePdf = () => {
        setShowPdfModal(false);
        setSelectedPdf(null);
    };

    if (loading && activeTab === 'topics') {
        return (
            <div className="min-h-screen flex items-center justify-center pt-32">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 pt-32 pb-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* Header & Tabs */}
                <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Chapter Content</h1>
                        <p className="text-gray-600 mt-1">Practice tests or review notes</p>
                    </div>

                    <div className="bg-white p-1 rounded-xl shadow-sm border border-gray-200 inline-flex">
                        <button
                            onClick={() => setActiveTab('topics')}
                            className={`px-6 py-2 rounded-lg font-medium text-sm transition-all duration-200 ${activeTab === 'topics'
                                ? 'bg-orange-500 text-white shadow-md'
                                : 'text-gray-600 hover:bg-gray-50'
                                }`}
                        >
                            Question Bank (Topics)
                        </button>
                        <button
                            onClick={() => setActiveTab('notes')}
                            className={`px-6 py-2 rounded-lg font-medium text-sm transition-all duration-200 ${activeTab === 'notes'
                                ? 'bg-orange-500 text-white shadow-md'
                                : 'text-gray-600 hover:bg-gray-50'
                                }`}
                        >
                            Notes & Resources
                        </button>
                    </div>
                </div>

                {/* Topics Tab */}
                {activeTab === 'topics' && (
                    <div className="animate-fade-in-up">
                        {selectedTopics.length > 0 && (
                            <div className="bg-orange-50 border-2 border-orange-200 rounded-xl p-4 mb-6 flex justify-between items-center animate-slide-in">
                                <p className="text-orange-900 font-bold">
                                    {selectedTopics.length} topic(s) selected
                                </p>
                                <button
                                    onClick={handleStartQuiz}
                                    className="bg-orange-600 text-white px-6 py-2 rounded-lg hover:bg-orange-700 transition shadow-lg shadow-orange-200 font-bold"
                                >
                                    Start Test
                                </button>
                            </div>
                        )}

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {topics.map((topic) => (
                                <div
                                    key={topic.id}
                                    onClick={() => toggleTopic(topic.id)}
                                    className={`bg-white rounded-xl shadow-lg p-6 cursor-pointer transition-all duration-200 group ${selectedTopics.includes(topic.id)
                                        ? 'border-2 border-orange-500 bg-orange-50 transform scale-[1.02]'
                                        : 'border border-gray-100 hover:border-orange-300 hover:shadow-xl hover:-translate-y-1'
                                        }`}
                                >
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1">
                                            <h3 className={`text-lg font-bold transition-colors ${selectedTopics.includes(topic.id) ? 'text-orange-700' : 'text-gray-900 group-hover:text-orange-600'}`}>{topic.name}</h3>
                                            {topic.description && (
                                                <p className="text-gray-600 text-sm mt-2 line-clamp-2">{topic.description}</p>
                                            )}
                                        </div>
                                        <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${selectedTopics.includes(topic.id)
                                            ? 'bg-orange-500 border-orange-500 scale-110'
                                            : 'border-gray-300 group-hover:border-orange-400'
                                            }`}>
                                            {selectedTopics.includes(topic.id) && (
                                                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                </svg>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {topics.length === 0 && !loading && (
                            <div className="text-center py-20 bg-white rounded-2xl border border-gray-100 shadow-sm">
                                <p className="text-gray-500 text-lg">No topics available for this chapter.</p>
                            </div>
                        )}
                    </div>
                )}

                {/* Notes Tab */}
                {activeTab === 'notes' && (
                    <div className="animate-fade-in-up">
                        {notesLoading ? (
                            <div className="flex justify-center py-20">
                                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-orange-500"></div>
                            </div>
                        ) : notesError ? (
                            <div className="bg-red-50 text-red-600 p-6 rounded-xl text-center border border-red-100">
                                <p className="font-bold">Unable to load notes</p>
                                <p className="text-sm mt-1">{typeof notesError === 'string' ? notesError : 'Please try again later or check if you are enrolled.'}</p>
                                {!courseId && (
                                    <p className="text-xs mt-2 text-red-400">*Navigation context missing. Please go back to Chapters.</p>
                                )}
                            </div>
                        ) : notes && notes.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {notes.map((note) => (
                                    <div
                                        key={note.id}
                                        className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer group"
                                        onClick={() => openPdf(note)}
                                    >
                                        <div className="h-40 bg-gray-100 relative flex items-center justify-center group-hover:bg-orange-50 transition-colors">
                                            <svg className="w-16 h-16 text-gray-400 group-hover:text-orange-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                                            </svg>
                                            <div className="absolute top-3 right-3 bg-white/80 backdrop-blur-sm px-2 py-1 rounded text-xs font-bold text-gray-600 border border-gray-200">
                                                PDF
                                            </div>
                                        </div>
                                        <div className="p-5">
                                            <h3 className="text-lg font-bold text-gray-800 line-clamp-1 group-hover:text-orange-600 transition-colors mb-1">{note.title}</h3>
                                            <p className="text-sm text-gray-500 line-clamp-2">{note.description || 'View this document'}</p>

                                            <button className="mt-4 w-full py-2 bg-gray-50 text-gray-700 font-semibold rounded-lg group-hover:bg-orange-500 group-hover:text-white transition-all text-sm">
                                                View Document
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-20 bg-white rounded-2xl border border-gray-100 shadow-sm">
                                <div className="bg-orange-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <svg className="w-8 h-8 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                    </svg>
                                </div>
                                <p className="text-gray-500 text-lg font-medium">No notes available for this chapter.</p>
                                <p className="text-gray-400 text-sm mt-2">Check back later for updates.</p>
                            </div>
                        )}
                    </div>
                )}
            </div>

            <PDFViewerModal
                isOpen={showPdfModal}
                onClose={closePdf}
                pdfUrl={selectedPdf?.url}
                title={selectedPdf?.title}
            />
        </div>
    );
}

export default TopicsPage;

