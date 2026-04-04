import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    fetchRankings,
    selectTopRankings,
    selectUserRank,
    selectTotalUsers,
    selectRankingsLoading,
} from '../redux/slices/rankingsSlice';
import { selectUser } from '../redux/slices/authSlice';
import Leaderboard from '../Components/Leaderboard';

function RankingsPage() {
    const dispatch = useDispatch();
    const user = useSelector(selectUser);
    const rankings = useSelector(selectTopRankings);
    const userRank = useSelector(selectUserRank);
    const totalUsers = useSelector(selectTotalUsers);
    const loading = useSelector(selectRankingsLoading);

    useEffect(() => {
        if (user?.id) {
            dispatch(fetchRankings({ limit: 50, userId: user.id }));
        }
    }, [dispatch, user?.id]);

    return (
        <div className="min-h-screen bg-gray-50 pt-32 pb-12">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="mb-8 text-center">
                    <h1 className="text-4xl font-bold text-gray-900 mb-2">🏆 Quiz Leaderboard</h1>
                    <p className="text-gray-600">See how you rank against other students</p>
                </div>

                {/* Leaderboard */}
                <div className="bg-white rounded-2xl shadow-lg p-6">
                    <Leaderboard
                        rankings={rankings}
                        userRank={userRank}
                        totalUsers={totalUsers}
                        loading={loading}
                        limit={50}
                    />
                </div>
            </div>
        </div>
    );
}

export default RankingsPage;
