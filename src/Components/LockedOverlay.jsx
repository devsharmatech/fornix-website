import React from 'react';

/**
 * LockedOverlay Component
 * Displays over locked courses/content
 */
function LockedOverlay({ onUpgradeClick, message = 'This course is locked' }) {
    return (
        <div className="absolute inset-0 bg-white/95 backdrop-blur-sm flex items-center justify-center z-20 rounded-xl">
            <div className="text-center p-8">
                {/* Lock Icon */}
                <div className="w-20 h-20 bg-gradient-to-br from-orange-100 to-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-10 h-10 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                </div>

                {/* Message */}
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    {message}
                </h3>
                <p className="text-gray-600 mb-6 max-w-sm mx-auto">
                    Upgrade to a premium plan to unlock full access to this course and all its content.
                </p>

                {/* Upgrade Button */}
                <button
                    onClick={onUpgradeClick}
                    className="px-8 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl font-bold shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300"
                >
                    Upgrade to Access →
                </button>
            </div>
        </div>
    );
}

export default LockedOverlay;
