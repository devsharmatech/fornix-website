import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import {
    fetchPYTTopics,
    selectPYTTopics,
    selectPYTSelectedSubject,
    selectPYTLoading,
    selectPYTError,
} from '../redux/slices/pytSlice';

function PYTTopics() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { subjectId } = useParams();

    const topics = useSelector(selectPYTTopics);
    const selectedSubject = useSelector(selectPYTSelectedSubject);
    const loading = useSelector(selectPYTLoading);
    const error = useSelector(selectPYTError);

    const [selectedYear, setSelectedYear] = useState('');
    const [availableYears, setAvailableYears] = useState([]);

    useEffect(() => {
        if (subjectId) {
            dispatch(fetchPYTTopics({ subjectId, year: selectedYear }));
        }
    }, [dispatch, subjectId, selectedYear]);

    // Extract all unique years from topics
    useEffect(() => {
        if (topics && topics.length > 0) {
            const years = new Set();
            topics.forEach(topic => {
                if (topic.years && Array.isArray(topic.years)) {
                    topic.years.forEach(year => years.add(year));
                }
            });
            setAvailableYears(Array.from(years).sort((a, b) => b - a));
        }
    }, [topics]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 pt-32">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading topics...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 pt-32">
                <div className="text-center max-w-md mx-4">
                    <svg className="w-16 h-16 text-red-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Error Loading Topics</h2>
                    <p className="text-gray-600 mb-6">{error}</p>
                    <button
                        onClick={() => dispatch(fetchPYTTopics({ subjectId, year: selectedYear }))}
                        className="px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition"
                    >
                        Retry
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 pt-32 pb-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="mb-8">
                    <button
                        onClick={() => navigate(-1)}
                        className="flex items-center text-gray-600 hover:text-orange-500 mb-4 transition"
                    >
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                        Back to Subjects
                    </button>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                        {selectedSubject?.name || 'PYT Topics'}
                    </h1>
                    <p className="text-gray-600">Browse topics and sub-topics by year</p>
                </div>

                {/* Year Filter */}
                {availableYears.length > 0 && (
                    <div className="bg-white rounded-xl shadow-md p-6 mb-6">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Filter by Year
                        </label>
                        <div className="flex flex-wrap gap-2">
                            <button
                                onClick={() => setSelectedYear('')}
                                className={`px-4 py-2 rounded-lg font-semibold transition ${selectedYear === ''
                                        ? 'bg-orange-500 text-white'
                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                    }`}
                            >
                                All Years
                            </button>
                            {availableYears.map((year) => (
                                <button
                                    key={year}
                                    onClick={() => setSelectedYear(year.toString())}
                                    className={`px-4 py-2 rounded-lg font-semibold transition ${selectedYear === year.toString()
                                            ? 'bg-orange-500 text-white'
                                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                        }`}
                                >
                                    {year}
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {/* Topics List */}
                {topics.length === 0 ? (
                    <div className="bg-white rounded-xl shadow-md p-12 text-center">
                        <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">No Topics Available</h3>
                        <p className="text-gray-600">
                            {selectedYear ? `No topics found for year ${selectedYear}` : 'There are no topics available for this subject yet.'}
                        </p>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {topics.map((topic) => (
                            <div
                                key={topic.id}
                                className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow"
                            >
                                {/* Topic Header */}
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex-1">
                                        <h3 className="text-xl font-bold text-gray-900 mb-2">{topic.topic}</h3>
                                        {topic.extra_explanation && (
                                            <p className="text-gray-600 text-sm mb-3">{topic.extra_explanation}</p>
                                        )}
                                    </div>
                                </div>

                                {/* Year Badges */}
                                {topic.years && topic.years.length > 0 && (
                                    <div className="mb-4">
                                        <p className="text-xs font-semibold text-gray-500 uppercase mb-2">Available Years</p>
                                        <div className="flex flex-wrap gap-2">
                                            {topic.years.map((year) => (
                                                <span
                                                    key={year}
                                                    className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-sm font-semibold"
                                                >
                                                    {year}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Sub-topics */}
                                {topic.sub_topics && topic.sub_topics.length > 0 && (
                                    <div className="border-t border-gray-200 pt-4">
                                        <p className="text-sm font-semibold text-gray-700 mb-2">Sub-topics:</p>
                                        <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                            {topic.sub_topics.map((subTopic, index) => (
                                                <li
                                                    key={index}
                                                    className="flex items-center text-gray-600 text-sm"
                                                >
                                                    <svg className="w-4 h-4 mr-2 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                                    </svg>
                                                    {subTopic}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}

                                {/* Practice Button */}
                                <button
                                    className="mt-4 w-full bg-orange-500 text-white py-2 rounded-lg hover:bg-orange-600 transition font-semibold"
                                    onClick={() => {
                                        // TODO: Navigate to practice questions page
                                    }}
                                >
                                    Practice Questions
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export default PYTTopics;
