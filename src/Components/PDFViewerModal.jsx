import React, { useState, useEffect } from 'react';

const PDFViewerModal = ({ isOpen, onClose, pdfUrl, title }) => {
    const [isImage, setIsImage] = useState(false);

    useEffect(() => {
        if (pdfUrl) {
            const extension = pdfUrl.split('?')[0].split('.').pop().toLowerCase();
            const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'];
            setIsImage(imageExtensions.includes(extension));
        }
    }, [pdfUrl]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-white/95 backdrop-blur-xl z-50 flex items-center justify-center p-0 md:p-6">
            <div className="bg-white rounded-none md:rounded-3xl w-full max-w-6xl h-full md:h-[90vh] flex flex-col shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] animate-scale-in overflow-hidden border border-gray-100">

                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-white/80 backdrop-blur-sm sticky top-0 z-10">
                    <h3 className="text-lg md:text-xl font-bold text-gray-900 line-clamp-1">{title || 'Document Viewer'}</h3>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 rounded-full transition-all text-gray-400 hover:text-gray-900 hover:rotate-90"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 bg-white relative overflow-auto flex items-center justify-center">
                    {pdfUrl ? (
                        isImage ? (
                            <div className="w-full h-full flex items-center justify-center p-4 bg-white">
                                <img
                                    src={pdfUrl}
                                    alt={title}
                                    className="max-w-full max-h-full object-contain select-none shadow-sm"
                                    onContextMenu={(e) => e.preventDefault()}
                                />
                            </div>
                        ) : (
                            <div className="w-full h-full bg-white flex items-center justify-center">
                                <iframe
                                    src={`${pdfUrl}#toolbar=0&navpanes=0&scrollbar=0`}
                                    className="w-full h-full border-none bg-white"
                                    title={title}
                                    style={{ backgroundColor: 'white' }}
                                    onContextMenu={(e) => e.preventDefault()}
                                ></iframe>
                            </div>
                        )
                    ) : (
                        <div className="flex flex-col items-center justify-center h-full text-gray-300 gap-3">
                            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center">
                                <span className="text-4xl opacity-50">📄</span>
                            </div>
                            <p className="font-medium">No document source provided.</p>
                        </div>
                    )}
                </div>

                {/* Footer (Security Warning/Watermark) */}
                <div className="px-6 py-4 bg-white/50 border-t border-gray-50 flex items-center justify-center gap-4">
                    <div className="h-px bg-gray-100 flex-1"></div>
                    <p className="text-[10px] md:text-xs text-gray-400 font-bold tracking-widest uppercase flex items-center gap-2">
                        <span className="w-1.5 h-1.5 bg-orange-500 rounded-full"></span>
                        Fornix Academy • Protected Content
                    </p>
                    <div className="h-px bg-gray-100 flex-1"></div>
                </div>
            </div>
        </div>
    );
};

export default PDFViewerModal;
