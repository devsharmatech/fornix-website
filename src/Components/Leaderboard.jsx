import React from 'react';

const Leaderboard = ({ rankings, userRank, totalUsers, loading, limit }) => {
    if (loading) {
        return (
            <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
            </div>
        );
    }

    if (!rankings || rankings.length === 0) {
        return (
            <div className="text-center py-12">
                <div className="bg-gray-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No Rankings Yet</h3>
                <p className="text-gray-500">Complete tests to see your ranking!</p>
            </div>
        );
    }

    const getMedalIcon = (rank) => {
        const medalProps = { className: "w-6 h-6 drop-shadow-sm" };
        switch (rank) {
            case 1:
                return (
                    <svg {...medalProps} viewBox="0 0 24 24" fill="none">
                        <path d="M12 15C13.6569 15 15 13.6569 15 12C15 10.3431 13.6569 9 12 9C10.3431 9 9 10.3431 9 12C9 13.6569 10.3431 15 12 15Z" fill="#FBBF24"/>
                        <path d="M12 2L14.802 6.634L19.947 7.836L16.511 11.77L16.944 17.062L12 15L7.056 17.062L7.489 11.77L4.053 7.836L9.198 6.634L12 2Z" stroke="#FBBF24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                );
            case 2:
                return (
                    <svg {...medalProps} viewBox="0 0 24 24" fill="none">
                        <circle cx="12" cy="12" r="8" stroke="#94A3B8" strokeWidth="2"/>
                        <path d="M12 8V16M8 12H16" stroke="#94A3B8" strokeWidth="2" strokeLinecap="round"/>
                    </svg>
                );
            case 3:
                return (
                    <svg {...medalProps} viewBox="0 0 24 24" fill="none">
                        <path d="M12 15L15 18H9L12 15Z" fill="#B45309" stroke="#B45309" strokeWidth="2"/>
                        <circle cx="12" cy="10" r="5" stroke="#B45309" strokeWidth="2"/>
                    </svg>
                );
            default:
                return null;
        }
    };

    const getRankColor = (rank) => {
        switch (rank) {
            case 1:
                return 'from-yellow-400 to-yellow-600';
            case 2:
                return 'from-gray-300 to-gray-500';
            case 3:
                return 'from-orange-400 to-orange-600';
            default:
                return 'from-orange-500 to-orange-600';
        }
    };

    return (
        <div className="space-y-4">
            {/* User's Rank Card (if available and not in top rankings) */}
            {userRank && userRank > (limit || 20) && (
                <div className="bg-gradient-to-r from-orange-100 to-orange-100 border-2 border-orange-300 rounded-xl p-4 mb-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                                #{userRank}
                            </div>
                            <div>
                                <p className="font-bold text-gray-900">Your Rank</p>
                                <p className="text-sm text-gray-600">Out of {totalUsers} users</p>
                            </div>
                        </div>
                        <div className="text-right">
                            <p className="text-xs text-gray-500">Keep going!</p>
                        </div>
                    </div>
                </div>
            )}

            {/* Top Rankings List */}
            <div className="space-y-3">
                {rankings.map((user, index) => {
                    const rank = index + 1;
                    const medal = getMedalIcon(rank);
                    const isCurrentUser = userRank === rank;

                    return (
                        <div
                            key={user.user_id || index}
                            className={`rounded-xl p-4 transition-all ${isCurrentUser
                                    ? 'bg-gradient-to-r from-orange-100 to-orange-100 border-2 border-orange-300 shadow-md'
                                    : 'bg-white border border-gray-200 hover:shadow-md'
                                }`}
                        >
                            <div className="flex items-center gap-4">
                                {/* Rank with Glow Effects */}
                                <div className="relative">
                                    {rank <= 3 && (
                                        <div className={`absolute inset-0 blur-xl opacity-40 rounded-full bg-gradient-to-br ${getRankColor(rank)}`}></div>
                                    )}
                                    <div className={`relative w-12 h-12 bg-gradient-to-br ${getRankColor(rank)} rounded-full flex items-center justify-center text-white font-bold text-lg flex-shrink-0 shadow-lg border-2 border-white/20`}>
                                        {medal || `#${rank}`}
                                    </div>
                                </div>

                                {/* User Info */}
                                <div className="flex-1">
                                    <div className="flex items-center gap-2">
                                        <p className="font-bold text-gray-900">
                                            {user.full_name || 'Anonymous User'}
                                        </p>
                                        {isCurrentUser && (
                                            <span className="bg-orange-500 text-white text-xs px-2 py-0.5 rounded-full font-semibold">
                                                You
                                            </span>
                                        )}
                                    </div>
                                    <div className="flex items-center gap-4 mt-1">
                                        <p className="text-sm text-gray-600">
                                            <span className="font-semibold">{user.total_score || 0}</span> points
                                        </p>
                                        {user.quizzes_completed && (
                                            <p className="text-sm text-gray-500">
                                                {user.quizzes_completed} test{user.quizzes_completed !== 1 ? 's' : ''}
                                            </p>
                                        )}
                                    </div>
                                </div>

                                {/* Score Badge */}
                                <div className="text-right">
                                    <div className={`px-4 py-2 rounded-lg ${rank <= 3 ? 'bg-gradient-to-r from-yellow-100 to-orange-100' : 'bg-gray-100'
                                        }`}>
                                        <p className="text-2xl font-bold text-gray-900">{user.total_score || 0}</p>
                                        <p className="text-xs text-gray-500">Score</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Total Users Info */}
            {totalUsers > 0 && (
                <div className="text-center pt-4 border-t border-gray-200">
                    <p className="text-sm text-gray-500">
                        Showing top {Math.min(rankings.length, limit || 20)} of {totalUsers} total users
                    </p>
                </div>
            )}
        </div>
    );
};

export default Leaderboard;
