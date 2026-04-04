import React, { useEffect } from 'react';
import ReactDOM from 'react-dom';

const TermsModal = ({ isOpen, onClose, onAgree }) => {
    // Prevent body scroll when modal is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    if (!isOpen) return null;

    return ReactDOM.createPortal(
        <div
            className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
            onClick={onClose}
            role="dialog"
            aria-modal="true"
        >
            <div
                className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden animate-fade-in"
                onClick={(e) => e.stopPropagation()}
                style={{ margin: '0 auto' }} // Ensure centering
            >
                {/* Header */}
                <div className="bg-orange-600 p-6 text-white text-center">
                    <h2 className="text-2xl font-bold">Terms & Conditions — Before Payment</h2>
                </div>

                {/* Content */}
                <div className="p-6 max-h-[70vh] overflow-y-auto">
                    <p className="font-bold text-gray-800 mb-4 text-center">
                        Please read carefully before making any payment:
                    </p>

                    <div className="space-y-4 text-gray-700 text-sm leading-relaxed">
                        <p className="flex gap-3">
                            <span className="text-red-500 font-bold text-lg">•</span>
                            <span>All purchases made on this platform are strictly <strong className="text-red-600">non-refundable and non-adjustable</strong> under any circumstances.</span>
                        </p>
                        <p className="flex gap-3">
                            <span className="text-red-500 font-bold text-lg">•</span>
                            <span>Subscriptions, plans, and QBank access cannot be transferred to another user or account.</span>
                        </p>
                        <p className="flex gap-3">
                            <span className="text-orange-500 font-bold text-lg">•</span>
                            <span>We strongly recommend that you review the sample content / free trial before purchasing any plan.</span>
                        </p>
                        <p className="flex gap-3">
                            <span className="text-green-600 font-bold text-lg">✔</span>
                            <span>Please make the payment only if you are satisfied with the sample and platform features.</span>
                        </p>
                        <p className="flex gap-3">
                            <span className="text-red-500 font-bold text-lg">•</span>
                            <span>No refunds will be issued for partial usage, change of mind, exam date changes, or personal reasons.</span>
                        </p>
                        <p className="flex gap-3">
                            <span className="text-red-500 font-bold text-lg">•</span>
                            <span>Technical access issues caused by incorrect email/mobile entry at checkout will be the user’s responsibility.</span>
                        </p>
                    </div>

                    <div className="mt-6 bg-orange-50 border border-orange-100 p-4 rounded-xl text-center">
                        <p className="text-orange-800 font-medium">
                            By proceeding with the payment, you confirm that you have read and agreed to these terms.
                        </p>
                    </div>
                </div>

                {/* Footer */}
                <div className="p-6 border-t bg-gray-50 flex gap-4">
                    <button
                        onClick={onClose}
                        className="flex-1 py-3 px-4 bg-white border border-gray-300 text-gray-700 font-bold rounded-xl hover:bg-gray-100 transition"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onAgree}
                        className="flex-1 py-3 px-4 bg-orange-600 text-white font-bold rounded-xl shadow-lg hover:bg-orange-700 transition transform hover:scale-[1.02]"
                    >
                        I Agree & Pay
                    </button>
                </div>
            </div>
        </div>,
        document.body
    );
};

export default TermsModal;
