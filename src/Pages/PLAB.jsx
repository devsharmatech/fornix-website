import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import banner from '../Assets/banner.webp';
import {
    fetchSubjectsByCourse,
    selectSubjects,
    selectSubjectsLoading,
    setSelectedSubject,
} from '../redux/slices/subjectsSlice';
import {
    fetchCoursesWithPlans,
} from '../redux/slices/coursesSlice';
import {
    fetchMockTestsByCourse,
    startMockTest,
    selectCourseMockTests,
    selectMockTestsLoading
} from '../redux/slices/mockTestsSlice';
import { showNotification } from '../redux/slices/uiSlice';
import { selectUser } from '../redux/slices/authSlice';
import UpgradePrompt from '../Components/UpgradePrompt';
import { canAccessCourse } from '../utils/accessControl';
import ChapterCountDisplay from '../Components/ChapterCountDisplay';
import { formatSubjectName } from '../utils/formatters';

function PLAB() {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    // PLAB 1 Course ID from API
    const COURSE_ID = "8dc42a27-cf5f-4b08-83ff-809e4f3f6fba";

    const subjects = useSelector(selectSubjects);
    const loading = useSelector(selectSubjectsLoading);
    const allCourses = useSelector(state => state.courses.courses);
    const course = allCourses.find(c => c.id === COURSE_ID);
    const mockTests = useSelector(selectCourseMockTests);
    const mockTestsLoading = useSelector(selectMockTestsLoading);
    const user = useSelector(selectUser);

    // Access control state
    const [showUpgradePrompt, setShowUpgradePrompt] = useState(false);
    const hasAccess = canAccessCourse(user, COURSE_ID);

    useEffect(() => {
        if (allCourses.length === 0) {
            dispatch(fetchCoursesWithPlans());
        }
        dispatch(fetchSubjectsByCourse(COURSE_ID));
        // Fetch mock tests for this course
        dispatch(fetchMockTestsByCourse(COURSE_ID));
    }, [dispatch, allCourses.length]);

    const handleSubjectClick = (subject) => {
        // Check if user has access to this course
        if (!hasAccess) {
            setShowUpgradePrompt(true);
            return;
        }

        dispatch(setSelectedSubject(subject));
        navigate(`/subjects/${subject.id}/chapters`);
    };

    const handleStartMockTest = async (test) => {
        try {
            const testId = test.id || test.test_id || test.uuid;
            const result = await dispatch(startMockTest(testId)).unwrap();

            // Navigate using attempt_id from the nested structure
            // The API returns: { success, message, attempt: { id, started_at }, questions: [] }
            const attemptId = result.attempt?.id || result.attempt_id || result.id || testId;

            // Save attempt info for refresh recovery
            localStorage.setItem('active_quiz_attempt_id', attemptId);
            localStorage.setItem('active_quiz_is_mock', 'true');

            navigate(`/quiz/taking/${attemptId}`);
        } catch (error) {
            console.error('Failed to start mock test:', error);
            dispatch(showNotification({
                type: 'error',
                message: typeof error === 'string' ? error : (error?.message || 'Failed to start mock test')
            }));
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center pt-32">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 pb-20">

            {/* Hero Section */}
            <section className="relative mb-16">
                <div className="relative h-auto min-h-[350px] md:h-100 overflow-hidden py-16 md:py-0">
                    <img
                        src={banner}
                        alt="PLAB 1 Banner"
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-linear-to-r from-orange-900/95 to-orange-800/70 flex flex-col justify-center px-6 md:px-20 pt-24 md:pt-32">
                        <div className="animate-fade-in-up">
                            <span className="bg-orange-500/20 text-orange-100 border border-orange-400/30 px-4 py-1.5 rounded-full text-sm font-semibold uppercase tracking-wider mb-4 inline-block backdrop-blur-sm">
                                UK Medical Licensing
                            </span>
                            <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
                                {course?.name || 'PLAB 1 Course'}
                            </h1>
                        </div>
                        <p className="text-orange-100 text-lg md:text-xl max-w-2xl animate-fade-in-up delay-100 leading-relaxed">
                            {course?.description || 'Your pathway to practicing medicine in the UK. Complete preparation for the Professional and Linguistic Assessments Board test.'}
                        </p>
                    </div>
                </div>
            </section>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-20 relative z-10">

                {/* Stats / Info Bar */}
                <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 mb-10 flex flex-wrap gap-8 items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900">PLAB Syllabus</h2>
                        <p className="text-gray-500 text-sm">GMC compliant study material</p>
                    </div>

                    <div className="flex gap-6 text-sm font-medium text-gray-600">
                        <div className="flex items-center gap-2">
                            <span className="w-10 h-10 rounded-full bg-orange-50 flex items-center justify-center">
                                <svg className="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                </svg>
                            </span>
                            <div>
                                <div className="font-bold text-gray-900">{subjects.length}</div>
                                <div className="text-xs">Subjects</div>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="w-10 h-10 rounded-full bg-orange-50 flex items-center justify-center">
                                <svg className="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                                </svg>
                            </span>
                            <div>
                                <div className="font-bold text-gray-900">Clinical</div>
                                <div className="text-xs">Simulations</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Mock Tests Section */}


                {subjects.length === 0 ? (
                    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
                        <div className="bg-linear-to-br from-orange-50 via-white to-orange-50 rounded-3xl shadow-2xl p-12 text-center border border-orange-100">
                            {/* Icon */}
                            <div className="mb-8">
                                <div className="w-24 h-24 mx-auto bg-linear-to-br from-orange-500 to-orange-500 rounded-full flex items-center justify-center shadow-lg">
                                    <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                            </div>

                            {/* Title */}
                            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                                Coming Soon
                            </h2>

                            {/* Subtitle */}
                            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed">
                                We're working hard to bring you comprehensive PLAB preparation materials.
                                Stay tuned for an amazing learning experience!
                            </p>

                            {/* Features Preview */}
                            <div className="grid md:grid-cols-3 gap-6 mb-10">
                                <div className="bg-white/60 backdrop-blur-sm rounded-xl p-6 shadow-md">
                                    <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                                        <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                        </svg>
                                    </div>
                                    <h3 className="font-semibold text-gray-900 mb-2">Comprehensive Notes</h3>
                                    <p className="text-sm text-gray-600">Detailed study materials covering all topics</p>
                                </div>

                                <div className="bg-white/60 backdrop-blur-sm rounded-xl p-6 shadow-md">
                                    <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                                        <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                                        </svg>
                                    </div>
                                    <h3 className="font-semibold text-gray-900 mb-2">Practice Tests</h3>
                                    <p className="text-sm text-gray-600">Test your knowledge with mock exams</p>
                                </div>

                                <div className="bg-white/60 backdrop-blur-sm rounded-xl p-6 shadow-md">
                                    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                                        <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                        </svg>
                                    </div>
                                    <h3 className="font-semibold text-gray-900 mb-2">Quick Revision</h3>
                                    <p className="text-sm text-gray-600">High-yield topics for last-minute prep</p>
                                </div>
                            </div>

                            {/* CTA */}
                            <div className="space-y-4">
                                <p className="text-gray-700 font-medium">
                                    Want to be notified when PLAB content is available?
                                </p>
                                <button
                                    onClick={() => navigate('/contact')}
                                    className="px-8 py-3 bg-linear-to-r from-orange-600 to-orange-600 text-white rounded-full font-semibold hover:from-orange-700 hover:to-orange-700 transition shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                                >
                                    Contact Us
                                </button>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {subjects.map((subject) => (
                            <div
                                key={subject.id}
                                onClick={() => handleSubjectClick(subject)}
                                className={`group bg-white rounded-2xl p-6 hover:shadow-xl transition-all duration-300 cursor-pointer border border-gray-100 hover:border-orange-200 relative overflow-hidden ${!hasAccess ? 'opacity-75' : ''
                                    }`}
                            >
                                <div className="absolute top-0 right-0 w-24 h-24 bg-linear-to-br from-orange-50 to-transparent rounded-bl-full opacity-50 group-hover:scale-110 transition-transform -mr-4 -mt-4"></div>

                                {/* Lock Icon for locked courses */}
                                {!hasAccess && (
                                    <div className="absolute top-3 right-3 w-8 h-8 bg-gray-900/80 backdrop-blur-sm rounded-full flex items-center justify-center z-20">
                                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                        </svg>
                                    </div>
                                )}

                                <div className="relative z-10">
                                    <div className="flex items-start justify-between mb-6">
                                        <div className="w-14 h-14 bg-linear-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-orange-200 group-hover:scale-110 transition-transform duration-300">
                                            <span className="text-2xl font-bold">{subject.name.charAt(0)}</span>
                                        </div>
                                        <span className="bg-orange-50 text-orange-600 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide">
                                            {subject.chapters?.length || subject.chapters_count || subject.chapter_count || '0'} Chapters
                                        </span>
                                    </div>

                                    <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-orange-600 transition-colors line-clamp-1">
                                        {subject.name}
                                    </h3>

                                    <p className="text-gray-600 text-sm line-clamp-2 mb-6 h-10 leading-relaxed">
                                        {subject.description || 'Comprehensive study modules covering key concepts and problem-solving techniques.'}
                                    </p>

                                    <div className="flex items-center text-orange-600 font-bold text-sm group-hover:translate-x-1 transition-transform">
                                        {!hasAccess ? 'Unlock to Access' : 'Start Learning'}
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

            {/* Upgrade Prompt Modal - Only show modal, no full-page overlay */}
            <UpgradePrompt
                isOpen={showUpgradePrompt}
                onClose={() => setShowUpgradePrompt(false)}
                feature="course_access"
                user={user}
                courseId={COURSE_ID}
                courseName={course?.name || 'PLAB 1'}
            />
        </div >
    );
}

export default PLAB;
