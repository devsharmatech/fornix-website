// ```javascript
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import { Document, Page, pdfjs } from 'react-pdf';
import {
    fetchChaptersBySubject,
    selectChapters,
    selectChaptersLoading,
    fetchChapterNotes,
    selectChapterNotes,
    setSelectedChapter,
} from '../redux/slices/chaptersSlice';
import { selectUser } from '../redux/slices/authSlice';
import { showNotification } from '../redux/slices/uiSlice';
import { getNoteType } from '../utils/accessControl';
import { FiBookOpen, FiFileText, FiChevronDown, FiMaximize2, FiX, FiAlertTriangle, FiEye } from 'react-icons/fi';
import { FaRegFilePdf } from 'react-icons/fa6';

pdfjs.GlobalWorkerOptions.workerSrc =
    `https://cdn.jsdelivr.net/npm/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

function AMCSubjectPage() {
    const { subjectId } = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const chapters = useSelector(selectChapters);
    const loading = useSelector(selectChaptersLoading);
    const user = useSelector(selectUser);
    const [activeTab, setActiveTab] = useState('quizzes');
    const [expandedNotes, setExpandedNotes] = useState({});

    // PDF Viewer State
    const [selectedPdf, setSelectedPdf] = useState(null);

    useEffect(() => {
        if (subjectId) {
            dispatch(fetchChaptersBySubject(subjectId));
        }
    }, [dispatch, subjectId]);

    // When chapters load, we could pre-fetch content?
    // For now, let's display chapters as Accordions or just Sections of content?
    // User wants "Subjects Only", implying flattened content.

    // If we have chapters, we can map through them and show their content.

    // Helper to toggle notes visibility for a chapter
    const toggleNotes = (chapterId) => {
        if (!expandedNotes[chapterId]) {
            const courseId = 'cc613b33-3986-4d67-b33a-009b57a72dc8'; // AMC Course ID
            const noteType = getNoteType(user, courseId);
            dispatch(fetchChapterNotes({
                courseId,
                chapterId,
                noteType
            }));
        }
        setExpandedNotes(prev => ({
            ...prev,
            [chapterId]: !prev[chapterId]
        }));
    };

    const handleOpenPdf = (note) => {
        const url = note.pdf_url || note.url;
        if (url) {
            setSelectedPdf({
                url: url,
                title: note.title || note.name || 'Document'
            });
        }
    };

    const closePdfViewer = () => {
        setSelectedPdf(null);
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center pt-32">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 pt-32 pb-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="mb-8 flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Study Content</h1>
                        <p className="text-gray-600 mt-2">Access all notes and question bank for this subject</p>
                    </div>
                    <button
                        onClick={() => navigate('/courses/amc')}
                        className="text-orange-600 font-bold hover:underline flex items-center gap-1"
                    >
                        ← Back to AMC
                    </button>
                </div>

                {/* Tabs */}
                <div className="flex gap-4 mb-8 border-b border-gray-200">
                    <button
                        onClick={() => setActiveTab('quizzes')}
                        className={`pb-3 px-1 font-bold text-lg transition-all flex items-center gap-2 ${activeTab === 'quizzes'
                            ? 'text-orange-500 border-b-2 border-orange-500'
                            : 'text-gray-400 hover:text-gray-600'
                            }`}
                    >
                        <FiBookOpen className={`w-5 h-5 ${activeTab === 'quizzes' ? 'text-orange-500' : 'text-gray-400'}`} />
                        Question Bank
                    </button>
                    <button
                        onClick={() => setActiveTab('notes')}
                        className={`pb-3 px-1 font-bold text-lg transition-all flex items-center gap-2 ${activeTab === 'notes'
                            ? 'text-orange-500 border-b-2 border-orange-500'
                            : 'text-gray-400 hover:text-gray-600'
                            }`}
                    >
                        <FiFileText className={`w-5 h-5 ${activeTab === 'notes' ? 'text-orange-500' : 'text-gray-400'}`} />
                        Study Notes
                    </button>
                </div>

                {/* Content Area */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 min-h-[400px]">
                    {chapters.length === 0 ? (
                        <div className="text-center py-20">
                            <p className="text-gray-500">No content available for this subject yet.</p>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            {chapters.map(chapter => (
                                <ChapterContentSection
                                    key={chapter.id}
                                    chapter={chapter}
                                    type={activeTab}
                                    isOpen={!!expandedNotes[chapter.id]}
                                    onToggle={() => toggleNotes(chapter.id)}
                                    onOpenPdf={handleOpenPdf}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Secure PDF Viewer Modal */}
            {selectedPdf && (
                <PDFViewerModal
                    pdfUrl={selectedPdf.url}
                    title={selectedPdf.title}
                    onClose={closePdfViewer}
                />
            )}
        </div>
    );
}

// Secure PDF Modal Component using react-pdf
function PDFViewerModal({ pdfUrl, title, onClose }) {
    const [numPages, setNumPages] = useState(null);
    const [pageNumber, setPageNumber] = useState(1);
    const [scale, setScale] = useState(1.0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Prevent right click
    const handleContextMenu = (e) => {
        e.preventDefault();
        return false;
    };

    function onDocumentLoadSuccess({ numPages }) {
        setNumPages(numPages);
        setLoading(false);
    }

    function onDocumentLoadError(error) {
        console.error('Error loading PDF:', error);
        setLoading(false);
        setError("Failed to load document. It might be restricted or unavailable.");
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-4 md:p-8" onContextMenu={handleContextMenu}>
            <div className="bg-white w-full h-full md:w-[90%] md:h-[90%] rounded-2xl overflow-hidden flex flex-col shadow-2xl relative">

                {/* Header */}
                <div className="bg-gray-900 text-white p-4 flex items-center justify-between shadow-md z-10 select-none">
                    <h3 className="font-bold text-lg truncate max-w-[80%]">
                        🔒 {title} (Protected View)
                    </h3>
                    <div className="flex items-center gap-3">
                        <div className="flex items-center bg-gray-800 rounded-lg px-2 py-1 gap-2">
                            <button onClick={() => setScale(s => Math.max(0.5, s - 0.1))} className="text-gray-400 hover:text-white pb-1">-</button>
                            <span className="text-xs">{Math.round(scale * 100)}%</span>
                            <button onClick={() => setScale(s => Math.min(2.0, s + 0.1))} className="text-gray-400 hover:text-white pb-1">+</button>
                        </div>
                        <button
                            onClick={onClose}
                            className="bg-gray-700 hover:bg-gray-600 p-2 rounded-full transition-colors"
                            title="Close Viewer"
                        >
                            <FiX className="w-5 h-5 text-white" />
                        </button>
                    </div>
                </div>

                {/* Viewer Container */}
                <div className="flex-1 relative bg-gray-200 overflow-hidden flex flex-col">

                    {/* Watermark Overlay (Deterrent) */}
                    <div className="absolute inset-0 pointer-events-none z-20 flex items-center justify-center opacity-[0.09] select-none overflow-hidden text-center">
                        <div className="transform -rotate-45">
                            <h1 className="text-7xl font-bold text-black whitespace-nowrap">FORNIX</h1>
                            <p className="text-3xl text-black font-semibold mt-4">FORNIX</p>
                        </div>
                    </div>

                    {/* PDF Content */}
                    <div className="flex-1 overflow-auto flex justify-center p-4 relative z-10">
                        {loading && (
                            <div className="absolute inset-0 flex items-center justify-center bg-gray-100 z-30">
                                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
                            </div>
                        )}

                        {error && (
                            <div className="absolute inset-0 flex items-center justify-center bg-gray-100 z-30 p-8 text-center">
                                <div className="max-w-md">
                                    <FiAlertTriangle className="w-16 h-16 text-red-400 mx-auto mb-4" />
                                    <h3 className="text-xl font-bold text-gray-900 mb-2">Error Loading Document</h3>
                                    <p className="text-gray-600 mb-4">{error}</p>
                                    <p className="text-xs text-gray-500">Note: Some documents may be  from external embedding.</p>
                                </div>
                            </div>
                        )}

                        {!error && (
                            <Document
                                file={pdfUrl}
                                onLoadSuccess={onDocumentLoadSuccess}
                                onLoadError={onDocumentLoadError}
                                className="shadow-lg"
                                loading={
                                    <div className="flex items-center justify-center h-64">
                                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
                                    </div>
                                }
                            >
                                <Page
                                    pageNumber={pageNumber}
                                    scale={scale}
                                    renderTextLayer={false} // Disable text selection for added security
                                    renderAnnotationLayer={false}
                                    className="bg-white shadow-xl"
                                />
                            </Document>
                        )}
                    </div>
                </div>

                {/* Footer Controls */}
                <div className="bg-white p-3 border-t border-gray-200 flex items-center justify-between select-none z-30">
                    <p className="text-xs text-red-500 font-semibold hidden md:block">
                        ⚠️ Protected Content: No Downloading
                    </p>

                    <div className="flex items-center gap-4 mx-auto md:mx-0">
                        <button
                            onClick={() => setPageNumber(p => Math.max(1, p - 1))}
                            disabled={pageNumber <= 1}
                            className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-4 py-2 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed font-medium transition-colors"
                        >
                            Previous
                        </button>
                        <span className="text-gray-900 font-medium whitespace-nowrap">
                            Page {pageNumber} of {numPages || '--'}
                        </span>
                        <button
                            onClick={() => setPageNumber(p => Math.min(numPages || 1, p + 1))}
                            disabled={pageNumber >= (numPages || 1)}
                            className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed font-medium transition-colors"
                        >
                            Next
                        </button>
                    </div>

                    <div className="w-4 hidden md:block"></div> {/* Spacer */}
                </div>
            </div>
        </div>
    );
}

// Sub-component to handle individual chapter content fetching/display
function ChapterContentSection({ chapter, type, isOpen, onToggle, onOpenPdf }) {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const notesData = useSelector(selectChapterNotes(chapter.id));

    // Determine content based on type
    const showNotes = type === 'notes';

    return (
        <div className="border border-gray-100 rounded-xl overflow-hidden">
            <button
                onClick={onToggle}
                className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 transition-colors text-left"
            >
                <div className="flex items-center gap-3">
                    <span className="bg-orange-100 text-orange-700 p-2 rounded-lg">
                        {showNotes ? '📄' : '❓'}
                    </span>
                    <span className="font-bold text-gray-800">{chapter.name}</span>
                </div>
                <FiChevronDown className={`w-5 h-5 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            {isOpen && (
                <div className="p-4 border-t border-gray-100 bg-white animate-fade-in-down">
                    {/* Notes Logic */}
                    {showNotes && (
                        <div>
                            {notesData.loading ? (
                                <div className="text-center py-4 text-gray-500">Loading notes...</div>
                            ) : notesData.notes && notesData.notes.length > 0 ? (
                                <div className="grid gap-3">
                                    {notesData.notes.map((note, idx) => (
                                        <button
                                            key={idx}
                                            onClick={() => onOpenPdf(note)}
                                            className="w-full flex items-center justify-between p-3 border border-gray-100 rounded-lg hover:border-orange-300 hover:bg-orange-50 transition-all group text-left"
                                        >
                                            <div className="flex items-center gap-3">
                                                <FaRegFilePdf className="w-6 h-6 text-red-500" />
                                                <span className="font-medium text-gray-700 group-hover:text-orange-700">
                                                    {note.title || `Note ${idx + 1}`}
                                                </span>
                                            </div>
                                            <span className="text-sm text-orange-600 opacity-0 group-hover:opacity-100 transition-opacity font-bold flex items-center gap-1">
                                                <FiEye className="w-4 h-4" />
                                                View Securely
                                            </span>
                                        </button>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-gray-400 text-sm italic">No notes found in this section.</p>
                            )}
                        </div>
                    )}

                    {/* Quizzes Logic */}
                    {!showNotes && (
                        <div className="flex items-center justify-between p-4 bg-orange-50 rounded-lg border border-orange-100">
                            <div>
                                <h4 className="font-bold text-gray-800">Chapter Test</h4>
                                <p className="text-sm text-gray-600">Test your knowledge on {chapter.name}</p>
                            </div>
                            <button
                                onClick={() => {
                                    dispatch(setSelectedChapter(chapter));
                                    navigate(`/quiz/start?chapterId=${chapter.id}`);
                                }}
                                className="bg-orange-600 text-white px-4 py-2 rounded-lg font-bold hover:bg-orange-700 transition shadow-sm"
                            >
                                Start Test
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

export default AMCSubjectPage;
