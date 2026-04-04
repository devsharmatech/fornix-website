import React from 'react';

/**
 * QuizAttemptsCounter Component
 * Shows how many of the free quiz attempts a user has USED.
 * Props:
 *   used  - number of quizzes taken so far (starts at 0)
 *   total - max free quizzes allowed (default 2)
 */
function QuizAttemptsCounter({ used = 0, total = 2 }) {
    const remaining = Math.max(0, total - used);
    // Progress bar fills as quizzes are USED (0 used = empty bar)
    const percentage = (used / total) * 100;

    // Determine color based on remaining attempts
    const getColor = () => {
        if (remaining === 0) return 'red';
        if (remaining === 1) return 'orange';
        return 'green';
    };

    const color = getColor();

    const colorClasses = {
        red: {
            bg: 'bg-red-50',
            border: 'border-red-200',
            text: 'text-red-700',
            icon: 'text-red-500',
            progress: 'bg-red-500'
        },
        orange: {
            bg: 'bg-orange-50',
            border: 'border-orange-200',
            text: 'text-orange-700',
            icon: 'text-orange-500',
            progress: 'bg-orange-500'
        },
        green: {
            bg: 'bg-green-50',
            border: 'border-green-200',
            text: 'text-green-700',
            icon: 'text-green-500',
            progress: 'bg-green-500'
        }
    };

    const classes = colorClasses[color];

    return (
        <div className={`${classes.bg} border ${classes.border} rounded-xl p-4 mb-6`}>
            <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                    <svg className={`w-5 h-5 ${classes.icon}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <span className={`font-semibold ${classes.text}`}>
                        Free Test Attempts
                    </span>
                </div>
                {/* Shows used/total e.g. 0/2, 1/2, 2/2 */}
                <span className={`text-2xl font-bold ${classes.text}`}>
                    {used}/{total}
                </span>
            </div>

            {/* Progress Bar — fills as quizzes are used */}
            <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                <div
                    className={`${classes.progress} h-2 rounded-full transition-all duration-300`}
                    style={{ width: `${percentage}%` }}
                ></div>
            </div>

            {/* Message */}
            <p className="text-sm text-gray-600">
                {remaining === 0 ? (
                    <span className="font-semibold">
                        You've used all free attempts. Upgrade for full Question Bank access!
                    </span>
                ) : remaining === 1 ? (
                    <span>
                        ⚠️ Only <strong>1 free test</strong> remaining. Upgrade for full Question Bank access.
                    </span>
                ) : (
                    <span>
                        You have <strong>{remaining} free tests</strong> remaining.
                    </span>
                )}
            </p>
        </div>
    );
}

export default QuizAttemptsCounter;
