import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
    fetchDiscussionPosts,
    selectCurrentDiscussionPosts,
    selectPostsLoading,
    selectDiscussions,
} from '../redux/slices/discussionsSlice';

const DiscussionPostsPage = () => {
    const { discussionId } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const posts = useSelector(selectCurrentDiscussionPosts);
    const loading = useSelector(selectPostsLoading);
    const discussions = useSelector(selectDiscussions);

    // Find the current discussion from the discussions list
    const currentDiscussion = discussions.find(d => d.id === discussionId);

    useEffect(() => {
        if (discussionId) {
            dispatch(fetchDiscussionPosts(discussionId));
        }
    }, [dispatch, discussionId]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center pt-32">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 pt-32 pb-20">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Back Button */}
                <button
                    onClick={() => navigate(-1)}
                    className="mb-6 flex items-center gap-2 text-orange-600 hover:text-orange-700 font-semibold transition-colors"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    Back to Discussions
                </button>

                {/* Discussion Header */}
                {currentDiscussion && (
                    <div className="bg-white rounded-2xl shadow-lg p-6 mb-6 border border-gray-200">
                        <div className="flex items-start justify-between mb-4">
                            <div className="flex-1">
                                <h1 className="text-3xl font-bold text-gray-900 mb-2">{currentDiscussion.title}</h1>
                                {currentDiscussion.description && (
                                    <p className="text-gray-600 mb-4">{currentDiscussion.description}</p>
                                )}
                            </div>
                            {currentDiscussion.subjects && (
                                <span className="bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-sm font-bold ml-4">
                                    {currentDiscussion.subjects.name}
                                </span>
                            )}
                        </div>

                        {/* Participating Doctors */}
                        {currentDiscussion.discussion_doctors && currentDiscussion.discussion_doctors.length > 0 && (
                            <div className="border-t border-gray-200 pt-4">
                                <p className="text-sm font-semibold text-gray-700 mb-3">
                                    👨‍⚕️ Participating Doctors
                                </p>
                                <div className="flex flex-wrap gap-2">
                                    {currentDiscussion.discussion_doctors.map((dd, idx) => (
                                        <div
                                            key={idx}
                                            className="bg-gradient-to-r from-orange-50 to-orange-50 border border-orange-200 rounded-lg px-3 py-2 flex items-center gap-2"
                                        >
                                            <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                                                {dd.doctors?.full_name?.charAt(0) || 'D'}
                                            </div>
                                            <span className="text-sm font-medium text-gray-800">
                                                {dd.doctors?.full_name || 'Doctor'}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* Posts Section */}
                <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                        <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                        </svg>
                        Discussion Posts ({posts.length})
                    </h2>

                    {posts.length === 0 ? (
                        <div className="text-center py-12">
                            <div className="bg-gray-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                </svg>
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">No posts yet</h3>
                            <p className="text-gray-500">Be the first to start the conversation!</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {posts.map((post) => (
                                <div
                                    key={post.id}
                                    className="border border-gray-200 rounded-xl p-5 hover:shadow-md transition-shadow"
                                >
                                    {/* Post Header */}
                                    <div className="flex items-start gap-3 mb-3">
                                        <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-orange-600 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">
                                            {post.users?.full_name?.charAt(0) || 'U'}
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 flex-wrap">
                                                <span className="font-semibold text-gray-900">
                                                    {post.users?.full_name || 'Unknown User'}
                                                </span>
                                                {post.edited && (
                                                    <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded">
                                                        Edited
                                                    </span>
                                                )}
                                                {post.is_answer && (
                                                    <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded flex items-center gap-1">
                                                        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                                        </svg>
                                                        Answer
                                                    </span>
                                                )}
                                            </div>
                                            <p className="text-xs text-gray-500">
                                                {new Date(post.created_at).toLocaleString('en-US', {
                                                    year: 'numeric',
                                                    month: 'short',
                                                    day: 'numeric',
                                                    hour: '2-digit',
                                                    minute: '2-digit'
                                                })}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Post Content */}
                                    <div className="ml-13 pl-3 border-l-2 border-orange-200">
                                        <p className="text-gray-800 whitespace-pre-wrap">{post.content}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default DiscussionPostsPage;
