import React from 'react';
import { useNavigate } from 'react-router-dom';

const DiscussionCard = ({ discussion }) => {
    const navigate = useNavigate();

    const handleJoinDiscussion = () => {
        navigate(`/discussions/${discussion.id}`);
    };
    return (
        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200 hover:shadow-lg transition-all">
            <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{discussion.title}</h3>
                    {discussion.description && (
                        <p className="text-gray-600 text-sm mb-3">{discussion.description}</p>
                    )}
                </div>
                {discussion.subjects && (
                    <span className="bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-xs font-bold ml-3">
                        {discussion.subjects.name}
                    </span>
                )}
            </div>

            {/* Participating Doctors */}
            {discussion.discussion_doctors && discussion.discussion_doctors.length > 0 && (
                <div>
                    <p className="text-sm font-semibold text-gray-700 mb-3">
                        👨‍⚕️ Participating Doctors ({discussion.discussion_doctors.length})
                    </p>
                    <div className="flex flex-wrap gap-2">
                        {discussion.discussion_doctors.map((dd, idx) => (
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

            {/* Join Discussion Button */}
            <button
                onClick={handleJoinDiscussion}
                className="mt-4 w-full bg-gradient-to-r from-orange-600 to-orange-600 text-white font-semibold py-2 px-4 rounded-lg hover:from-orange-700 hover:to-orange-700 transition-all flex items-center justify-center gap-2"
            >                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                Join Discussion
            </button>
        </div>
    );
};

export default DiscussionCard;
