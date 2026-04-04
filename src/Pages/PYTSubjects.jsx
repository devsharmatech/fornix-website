import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import {
    fetchPYTSubjects,
    setSelectedSubject,
    selectPYTSubjects,
    selectPYTLoading,
    selectPYTError,
} from '../redux/slices/pytSlice';

function PYTSubjects() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { courseId } = useParams();

    const subjects = useSelector(selectPYTSubjects);
    const loading = useSelector(selectPYTLoading);
    const error = useSelector(selectPYTError);

    useEffect(() => {
        if (courseId) {
            dispatch(fetchPYTSubjects(courseId));
        }
    }, [dispatch, courseId]);

    const handleSubjectClick = (subject) => {
        dispatch(setSelectedSubject(subject));
        navigate(`/pyt/${subject.id}/topics`);
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 pt-32">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading PYT subjects...</p>
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
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Error Loading Subjects</h2>
                    <p className="text-gray-600 mb-6">{error}</p>
                    <button
                        onClick={() => dispatch(fetchPYTSubjects(courseId))}
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
                        Back
                    </button>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Previous Year Topics (PYT)</h1>
                    <p className="text-gray-600">Practice questions from previous years organized by subject</p>
                </div>

                {/* Subjects Grid */}
                {subjects.length === 0 ? (
                    <div className="bg-white rounded-xl shadow-md p-12 text-center">
                        <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">No PYT Subjects Available</h3>
                        <p className="text-gray-600">There are no previous year topics available for this course yet.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {subjects.map((subject) => (
                            <div
                                key={subject.id}
                                className="bg-white rounded-xl shadow-md p-6 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer border border-gray-100"
                            >
                                {/* Subject Header */}
                                <div className="mb-4">
                                    <h3 className="text-xl font-bold text-gray-900 mb-2">{subject.name}</h3>
                                    <div className="flex items-center text-sm text-gray-600">
                                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                        </svg>
                                        <span>{subject.topics_count} {subject.topics_count === 1 ? 'Topic' : 'Topics'}</span>
                                    </div>
                                </div>

                                {/* Year Badges */}
                                <div className="border-t border-gray-200 pt-4">
                                    <p className="text-xs font-semibold text-gray-500 uppercase mb-2">Available Years</p>
                                    <div className="flex flex-wrap gap-2">
                                        {subject.years && subject.years.length > 0 ? (
                                            subject.years.map((year) => (
                                                <span
                                                    key={year}
                                                    className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-sm font-semibold"
                                                >
                                                    {year}
                                                </span>
                                            ))
                                        ) : (
                                            <span className="text-gray-400 text-sm">No years available</span>
                                        )}
                                    </div>
                                </div>

                                {/* Action Button */}
                                <button
                                    className="mt-4 w-full bg-orange-500 text-white py-2 rounded-lg hover:bg-orange-600 transition font-semibold"
                                    onClick={() => handleSubjectClick(subject)}
                                >
                                    Practice Now
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export default PYTSubjects;
