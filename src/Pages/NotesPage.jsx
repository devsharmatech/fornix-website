import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import { Document, Page, pdfjs } from 'react-pdf';
import {
    fetchNotes,
    selectNotes,
    selectNotesLoading,
    selectNotesError,
} from '../redux/slices/notesSlice';

// Configure PDF.js worker
// Configure PDF.js worker for Vite
pdfjs.GlobalWorkerOptions.workerSrc = new URL(
    'pdfjs-dist/build/pdf.worker.min.mjs',
    import.meta.url,
).toString();

function NotesPage() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { topicId } = useParams();

    const notes = useSelector(selectNotes);
    const loading = useSelector(selectNotesLoading);
    const error = useSelector(selectNotesError);

    const [searchQuery, setSearchQuery] = useState('');
    const [selectedNote, setSelectedNote] = useState(null);
    const [numPages, setNumPages] = useState(null);
    const [pageNumber, setPageNumber] = useState(1);

    useEffect(() => {
        // Fetch notes using the specific payload requested
        const payload = {
            course_id: "cc613b33-3986-4d67-b33a-009b57a72dc8",
            subject_id: "",
            note_type: "sample"
        };
        dispatch(fetchNotes(payload));
    }, [dispatch]);

    const filteredNotes = React.useMemo(() => {
        if (!notes || !Array.isArray(notes)) return [];

        if (!searchQuery) return notes;

        return notes.filter(note =>
            note.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            note.description?.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [notes, searchQuery]);

    const handleDownload = (note) => {
        if (note.pdf_url) {
            window.open(note.pdf_url, '_blank');
        }
    };

    const handleView = (note) => {
        setSelectedNote(note);
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 pt-32">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading notes...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 pt-32 pb-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 mb-2">Study Notes</h1>
                            <p className="text-gray-600">Access your course materials and study resources</p>
                        </div>
                        <button
                            onClick={() => navigate(-1)}
                            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
                        >
                            ← Back
                        </button>
                    </div>

                    {/* Search Bar */}
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Search notes..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full px-4 py-3 pl-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        />
                        <svg
                            className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </div>
                </div>

                {/* Error State */}
                {error && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                        <p className="text-red-800">{error}</p>
                    </div>
                )}

                {/* Notes Grid */}
                {filteredNotes.length === 0 ? (
                    <div className="bg-white rounded-xl shadow-md p-12 text-center">
                        <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">No Notes Available</h3>
                        <p className="text-gray-600">
                            {searchQuery ? 'No notes match your search' : 'Notes will appear here once they are added to this topic'}
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredNotes.map((note, index) => (
                            <div
                                key={note.id || index}
                                className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow"
                            >
                                {/* Note Preview/Icon */}
                                <div className="h-40 bg-gradient-to-br from-orange-100 to-orange-200 flex items-center justify-center">
                                    <svg className="w-16 h-16 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                    </svg>
                                </div>

                                {/* Note Details */}
                                <div className="p-6">
                                    {/* Subject Badge */}
                                    {note.subject?.name && (
                                        <div className="mb-3">
                                            <span className="inline-block px-3 py-1 bg-orange-100 text-orange-700 text-xs font-semibold rounded-full">
                                                {note.subject.name}
                                            </span>
                                        </div>
                                    )}

                                    <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2">
                                        {note.title || 'Untitled Note'}
                                    </h3>
                                    <p className="text-sm text-gray-600 mb-4 line-clamp-3">
                                        {note.description || 'No description available'}
                                    </p>

                                    {/* Metadata */}
                                    <div className="flex items-center gap-4 text-xs text-gray-500 mb-4">
                                        {note.note_type && (
                                            <span className="px-2 py-1 bg-orange-100 text-orange-600 rounded capitalize">
                                                {note.note_type}
                                            </span>
                                        )}
                                        {note.created_at && (
                                            <span>{new Date(note.created_at).toLocaleDateString()}</span>
                                        )}
                                    </div>

                                    {/* Actions */}
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => handleView(note)}
                                            className="flex-1 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition text-sm font-semibold"
                                        >
                                            View
                                        </button>
                                        <button
                                            onClick={() => handleDownload(note)}
                                            className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition text-sm font-semibold"
                                        >
                                            Download
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Note Viewer Modal */}
                {selectedNote && (
                    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50">
                        <div className="bg-white rounded-xl shadow-2xl w-full max-w-6xl h-[90vh] flex flex-col">
                            {/* Modal Header */}
                            <div className="flex items-center justify-between p-4 border-b border-gray-200 shrink-0">
                                <h2 className="text-xl font-bold text-gray-900 truncate pr-4">{selectedNote.title}</h2>
                                <button
                                    onClick={() => setSelectedNote(null)}
                                    className="p-2 hover:bg-gray-100 rounded-lg transition"
                                >
                                    <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>

                            {/* Modal Content */}
                            <div className="flex-1 bg-gray-100 overflow-hidden relative flex flex-col">
                                {selectedNote.pdf_url ? (
                                    <>
                                        <Document
                                            file={selectedNote.pdf_url}
                                            onLoadSuccess={({ numPages }) => {
                                                setNumPages(numPages);
                                                setPageNumber(1);
                                            }}
                                            onLoadError={(error) => console.error('Error loading PDF:', error)}
                                            className="flex-1 overflow-auto flex items-center justify-center"
                                        >
                                            <Page
                                                pageNumber={pageNumber}
                                                renderTextLayer={true}
                                                renderAnnotationLayer={true}
                                                className="max-w-full"
                                                width={Math.min(window.innerWidth * 0.8, 1200)}
                                            />
                                        </Document>

                                        {/* PDF Controls */}
                                        {numPages && (
                                            <div className="bg-white border-t border-gray-200 p-4 flex items-center justify-between shrink-0">
                                                <button
                                                    onClick={() => setPageNumber(prev => Math.max(prev - 1, 1))}
                                                    disabled={pageNumber <= 1}
                                                    className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition disabled:bg-gray-300 disabled:cursor-not-allowed"
                                                >
                                                    ← Previous
                                                </button>

                                                <span className="text-gray-700 font-medium">
                                                    Page {pageNumber} of {numPages}
                                                </span>

                                                <button
                                                    onClick={() => setPageNumber(prev => Math.min(prev + 1, numPages))}
                                                    disabled={pageNumber >= numPages}
                                                    className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition disabled:bg-gray-300 disabled:cursor-not-allowed"
                                                >
                                                    Next →
                                                </button>
                                            </div>
                                        )}
                                    </>
                                ) : selectedNote.content ? (
                                    <div className="p-6 overflow-y-auto h-full prose max-w-none">
                                        <p className="text-gray-700 whitespace-pre-wrap">{selectedNote.content}</p>
                                    </div>
                                ) : (
                                    <div className="flex flex-col items-center justify-center h-full">
                                        <p className="text-gray-600 mb-4">Content not available for preview.</p>
                                        <button
                                            onClick={() => handleDownload(selectedNote)}
                                            className="px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition"
                                        >
                                            Download File
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default NotesPage;

