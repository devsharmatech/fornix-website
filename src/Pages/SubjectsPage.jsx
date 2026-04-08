import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import {
    fetchSubjectsByCourse,
    selectSubjects,
    selectSubjectsLoading,
    setSelectedSubject,
} from '../redux/slices/subjectsSlice';
import {
    fetchCoursesWithPlans,
    selectCourses
} from '../redux/slices/coursesSlice';
import {
    fetchMockTestsByCourse,
    startMockTest,
    selectCourseMockTests,
    selectMockTestsLoading
} from '../redux/slices/mockTestsSlice'; // Assuming these exist or we skip mock tests if not generic enough
import { showNotification } from '../redux/slices/uiSlice';
import banner from '../Assets/banner.webp'; // Default banner
import UniversityExamsSection from '../Components/UniversityExamsSection';
import ChapterCountDisplay from '../Components/ChapterCountDisplay';
import { formatSubjectName } from '../utils/formatters';

function SubjectsPage() {
    const { courseId } = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const subjects = useSelector(selectSubjects);
    const loading = useSelector(selectSubjectsLoading);
    const courses = useSelector(selectCourses);
    const course = courses.find(c => c.id === courseId);

    // Mock Tests Logic (Generic)
    const mockTests = useSelector(selectCourseMockTests);
    const mockTestsLoading = useSelector(selectMockTestsLoading);

    useEffect(() => {
        if (courseId) {
            dispatch(fetchSubjectsByCourse(courseId));
            dispatch(fetchMockTestsByCourse(courseId));
        }
        if (courses.length === 0) {
            dispatch(fetchCoursesWithPlans());
        }
    }, [dispatch, courseId, courses.length]);

    const handleSubjectClick = (subject) => {
        dispatch(setSelectedSubject(subject));
        // Pass courseId in state so ChaptersPage can use it for Notes fetching
        navigate(`/subjects/${subject.id}/chapters`, { state: { courseId } });
    };

    const handleStartMockTest = async (test) => {
        try {
            const testId = test.id || test.test_id || test.uuid;
            const result = await dispatch(startMockTest(testId)).unwrap();
            const attemptId = result.attempt?.id || result.attempt_id || result.id || testId;

            // Save attempt info for refresh recovery
            localStorage.setItem('active_quiz_attempt_id', attemptId);
            localStorage.setItem('active_quiz_is_mock', 'true');

            navigate(`/quiz/taking/${attemptId}`);
        } catch (error) {
            dispatch(showNotification({
                type: 'error',
                message: error?.message || 'Failed to start mock test'
            }));
        }
    };

    if (loading && subjects.length === 0) {
        return (
            <div className="min-h-screen flex items-center justify-center pt-32">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 pt-32 pb-20">
            {/* Hero Section */}
            <section className="relative mb-16">
                <div className="relative h-75 md:h-100 overflow-hidden">
                    <img
                        src={course?.image_url || banner}
                        alt="Course Banner"
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-linear-to-r from-orange-900/95 to-orange-800/70 flex flex-col justify-center px-6 md:px-20">
                        <div className="animate-fade-in-up">
                            <span className="bg-orange-500/20 text-orange-100 border border-orange-400/30 px-4 py-1.5 rounded-full text-sm font-semibold uppercase tracking-wider mb-4 inline-block backdrop-blur-sm">
                                Course Content
                            </span>
                            <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
                                {course?.name || 'Course Subjects'}
                            </h1>
                        </div>
                        <p className="text-orange-100 text-lg md:text-xl max-w-2xl animate-fade-in-up delay-100 leading-relaxed">
                            {course?.description || 'Explore the subjects and chapters available in this course.'}
                        </p>
                    </div>
                </div>
            </section>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-20 relative z-10">

                {/* Stats Bar */}
                <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 mb-10 flex flex-wrap gap-8 items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900">Study Modules</h2>
                        <p className="text-gray-500 text-sm">Select a subject to begin</p>
                    </div>
                    <div className="flex gap-6 text-sm font-medium text-gray-600">
                        <div className="flex items-center gap-2">
                            <span className="w-10 h-10 rounded-full bg-orange-50 flex items-center justify-center text-orange-600">📚</span>
                            <div>
                                <div className="font-bold text-gray-900">{subjects.length}</div>
                                <div className="text-xs">Subjects</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* University Exams Section */}
                <UniversityExamsSection courseId={courseId} />

                {/* Mock Tests (Generic) */}
                {!mockTestsLoading && mockTests.length > 0 && (
                    <div className="mb-10 bg-linear-to-r from-orange-600 to-orange-600 rounded-3xl p-8 shadow-xl text-white">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-2xl font-bold">Mock Tests</h2>
                            <span className="bg-white/20 px-3 py-1 rounded-full text-sm">{mockTests.length} Available</span>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {mockTests.slice(0, 3).map(test => (
                                <div key={test.id} className="bg-white/10 p-4 rounded-xl border border-white/20 backdrop-blur-sm">
                                    <h3 className="font-bold text-lg mb-2">{test.title}</h3>
                                    <button onClick={() => handleStartMockTest(test)} className="w-full py-2 bg-white text-orange-600 rounded-lg font-bold hover:bg-orange-50 transition">Start Test</button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Subjects Grid */}
                {subjects.length === 0 ? (
                    <div className="text-center py-20 bg-white rounded-xl shadow-sm border border-gray-100">
                        <p className="text-gray-500 text-lg">No subjects available yet.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {subjects.map((subject) => (
                            <div
                                key={subject.id}
                                onClick={() => handleSubjectClick(subject)}
                                className="group bg-white rounded-2xl p-6 hover:shadow-xl transition-all duration-300 cursor-pointer border border-gray-100 hover:border-orange-200 relative overflow-hidden"
                            >
                                <div className="absolute top-0 right-0 w-24 h-24 bg-linear-to-br from-orange-50 to-transparent rounded-bl-full opacity-50 group-hover:scale-110 transition-transform -mr-4 -mt-4"></div>
                                <div className="relative z-10">
                                    <div className="flex items-start justify-between mb-6">
                                        <div className="w-14 h-14 bg-linear-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-orange-200 group-hover:scale-110 transition-transform duration-300">
                                            <span className="text-2xl font-bold">{formatSubjectName(subject.name).charAt(0)}</span>
                                        </div>
                                        <ChapterCountDisplay subject={subject} />
                                    </div>
                                    <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-orange-600 transition-colors line-clamp-1">
                                        {formatSubjectName(subject.name)}
                                    </h3>
                                    <p className="text-gray-600 text-sm line-clamp-2 mb-6 h-10 leading-relaxed">
                                        {subject.description || 'Access comprehensive study materials.'}
                                    </p>
                                    <div className="flex items-center text-orange-600 font-bold text-sm group-hover:translate-x-1 transition-transform">
                                        Start Learning
                                        <svg className="w-4 h-4 ml-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                        </svg>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export default SubjectsPage;
