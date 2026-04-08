import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
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
  selectCourseMockTests,
  selectMockTestsLoading,
  startMockTest,
} from '../redux/slices/mockTestsSlice';
import { showNotification } from '../redux/slices/uiSlice';
import {
  fetchPodcastSubjects,
  fetchPodcastsBySubject,
  selectPodcastSubjects,
  selectCurrentSubjectPodcasts,
  selectPodcastsLoading,
  selectPodcastsLoadingBySubject,
} from '../redux/slices/podcastsSlice';
import PodcastPlayer from '../Components/PodcastPlayer';
import ChapterCountDisplay from '../Components/ChapterCountDisplay';
import { formatSubjectName } from '../utils/formatters';
import {
  fetchDiscussions,
  selectDiscussions,
  selectDiscussionsLoading,
} from '../redux/slices/discussionsSlice';
import DiscussionCard from '../Components/DiscussionCard';
import UniversityExamsSection from '../Components/UniversityExamsSection';

import RazorpayCheckout from '../Components/RazorpayCheckout';
import { selectUser } from '../redux/slices/authSlice';
import {
  selectUserProfile,
  fetchUserDetails
} from '../redux/slices/userSlice';
import { selectPlans, fetchEnrolledCourses } from '../redux/slices/coursesSlice';
import UpgradePrompt from '../Components/UpgradePrompt';
import { canAccessCourse } from '../utils/accessControl';
import SubjectQuizModal from '../Components/SubjectQuizModal';
import {
  FiTarget, FiZap, FiFileText, FiClock, FiCheckCircle, FiBook,
  FiHeadphones, FiMic, FiMessageCircle, FiUsers, FiGlobe
} from 'react-icons/fi';
import { FaGraduationCap } from 'react-icons/fa6';
import { LuLightbulb } from 'react-icons/lu';

const isValidUUID = (value) =>
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value);


function AMC() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  // Scroll to pricing section if navigated with #pricing hash
  useEffect(() => {
    if (location.hash === '#pricing') {
      // Wait for content to render before scrolling
      const timer = setTimeout(() => {
        const pricingEl = document.getElementById('pricing');
        if (pricingEl) {
          pricingEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 400);
      return () => clearTimeout(timer);
    }
  }, [location.hash]);

  // Preference selection state
  const [preferences, setPreferences] = useState({});
  const [allSelected, setAllSelected] = useState(false);
  const [selectedPodcastSubject, setSelectedPodcastSubject] = useState(null);
  const [showUpgradePrompt, setShowUpgradePrompt] = useState(false);
  const [upgradeFeature, setUpgradeFeature] = useState('course_access');
  const [isSubjectModalOpen, setIsSubjectModalOpen] = useState(false);
  const [selectedSubjectQuiz, setSelectedSubjectQuiz] = useState(null);
  const pricingSectionRef = React.useRef(null);

  // AMC Course ID found from API
  const COURSE_ID = "cc613b33-3986-4d67-b33a-009b57a72dc8";



  const subjects = useSelector(selectSubjects);
  const loading = useSelector(selectSubjectsLoading);
  const mockTests = useSelector(selectCourseMockTests);
  const mockTestsLoading = useSelector(selectMockTestsLoading);
  const podcastSubjects = useSelector(selectPodcastSubjects);
  const podcastsLoading = useSelector(selectPodcastsLoading);
  const currentPodcasts = useSelector(selectCurrentSubjectPodcasts);
  const podcastsLoadingBySubject = useSelector(selectPodcastsLoadingBySubject);
  const discussions = useSelector(selectDiscussions);
  const discussionsLoading = useSelector(selectDiscussionsLoading);
  const user = useSelector(selectUser);
  const userProfile = useSelector(selectUserProfile);
  const plans = useSelector(selectPlans);

  // Use the most complete user object available
  const activeUser = userProfile || user;

  // Select course from the list of all courses instead of fetching details
  const allCourses = useSelector(state => state.courses.courses);
  const course = allCourses.find(c => c.id === COURSE_ID);

  useEffect(() => {
    // Fetch subjects for this course
    dispatch(fetchSubjectsByCourse(COURSE_ID));
    // Fetch mock tests for this course
    dispatch(fetchMockTestsByCourse(COURSE_ID));
    // Fetch podcast subjects for this course
    dispatch(fetchPodcastSubjects(COURSE_ID));
    // Fetch discussions for this course
    dispatch(fetchDiscussions(COURSE_ID));
  }, [dispatch]);

  useEffect(() => {
    // If courses aren't loaded, fetch them
    if (allCourses.length === 0) {
      dispatch(fetchCoursesWithPlans());
    }
  }, [dispatch, allCourses.length]);

  useEffect(() => {
    // Ensure we have full user profile
    if (user && user.id && !userProfile) {
      dispatch(fetchUserDetails(user.id));
    }
  }, [dispatch, user, userProfile]);

  // Debug: Log mock tests data
  useEffect(() => {
  }, [mockTests, mockTestsLoading]);

  // Debug Access
  useEffect(() => {
    if (activeUser) {
      const hasAccess = canAccessCourse(activeUser, COURSE_ID);
    }
  }, [activeUser, userProfile]);

  // Debug: Log podcasts data
  useEffect(() => {
  }, [podcastSubjects, podcastsLoading]);

  // Features comparison data
  const features = [
    { id: 1, name: 'No. Of Clinical Questions / Scenarios', fornix: '7000+', others: '1500 - 2000 Q\'s' },
    { id: 2, name: 'Smart Tutor Doubt Solving', fornix: 'Only with us', others: 'No' },
    { id: 3, name: 'Explanation By', fornix: 'Text & Audio Both', others: 'Only Text' },
    { id: 4, name: 'Previous Year Questions', fornix: 'Yes 500+ Q', others: 'No' },
    { id: 5, name: 'Frequently Asked Topics', fornix: 'Yes (Newly Introduced)', others: 'No' },
    { id: 6, name: 'Questions Difficulty Level', fornix: 'Easy, Moderate, High', others: 'Single standard' },
    { id: 7, name: 'Upgrade Status', fornix: 'Monthly', others: 'Not upgraded' },
  ];

  // Check if all preferences are selected
  useEffect(() => {
    const allFeaturesSelected = features.every(feature => preferences[feature.id] !== undefined);
    setAllSelected(allFeaturesSelected);
  }, [preferences]);

  const handlePreferenceSelect = (featureId, choice) => {
    setPreferences(prev => ({
      ...prev,
      [featureId]: choice
    }));
  };

  const handleEnrollClick = () => {
    pricingSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleStartMockTest = async (test) => {
    // Check if user has access to the course content (enrolled/paid)
    if (!canAccessCourse(activeUser, COURSE_ID)) {
      setUpgradeFeature('mock_test');
      setShowUpgradePrompt(true);
      dispatch(showNotification({
        type: 'warning',
        message: 'Unlock this course to access Mock Tests!'
      }));
      return;
    }

    // Check if user has access to this specific course
    // If not, show upgrade prompt
    if (!canAccessCourse(activeUser, COURSE_ID)) {
      setUpgradeFeature('course_access');
      setShowUpgradePrompt(true);
      /*
      dispatch(showNotification({
        type: 'warning',
        message: 'Upgrade to access mock tests!'
      }));
      */
      return;
    }

    try {
      // Use the test's UUID (could be 'id', 'test_id', or 'uuid' depending on API response)
      const testId = test.id || test.test_id || test.uuid;
      const result = await dispatch(startMockTest(testId)).unwrap();
      // Navigate to quiz taking page with the attempt ID (not test ID)
      // The API returns: { success, message, attempt: { id, started_at }, questions: [] }
      const attemptId = result.attempt?.id || result.attempt_id || result.id || testId;
      
      // Save attempt info for refresh recovery
      localStorage.setItem('active_quiz_attempt_id', attemptId);
      localStorage.setItem('active_quiz_is_mock', 'true');

      navigate(`/quiz/taking/${attemptId}`, {
        state: { isMockTest: true, testId: testId }
      });
    } catch (error) {
      console.error('Failed to start mock test:', error);
      dispatch(showNotification({
        type: 'error',
        message: typeof error === 'string' ? error : (error?.message || 'Failed to start mock test')
      }));
    }
  };

  const handleSubjectClick = (subject) => {
    if (!canAccessCourse(activeUser, COURSE_ID)) {
      setUpgradeFeature('course_access');
      setShowUpgradePrompt(true);
      return;
    }
    dispatch(setSelectedSubject(subject));
    navigate(`/subjects/${subject.id}/chapters`, { state: { courseId: COURSE_ID } });
  };

  const handlePracticeClick = (e, subject) => {
    e.stopPropagation(); // Don't trigger subject click (chapter navigation)
    if (!canAccessCourse(activeUser, COURSE_ID)) {
      setUpgradeFeature('course_access');
      setShowUpgradePrompt(true);
      return;
    }
    setSelectedSubjectQuiz(subject);
    setIsSubjectModalOpen(true);
  };

  const handlePodcastSubjectClick = async (subject) => {
    try {
      setSelectedPodcastSubject(subject.id === selectedPodcastSubject ? null : subject.id);
      if (subject.id !== selectedPodcastSubject) {
        await dispatch(fetchPodcastsBySubject({
          courseId: COURSE_ID,
          subjectId: subject.id
        })).unwrap();
      }
    } catch (error) {
      console.error('Failed to fetch podcasts:', error);
      dispatch(showNotification({
        type: 'error',
        message: 'Failed to load podcasts'
      }));
    }
  };



  const handlePaymentSuccess = async () => {
    try {
      let userId = user?.user_id || user?.uuid || user?.id;
      if (!isValidUUID(userId)) userId = '0c8a7950-df05-47e2-881f-5116b762ad5e';

      await dispatch(fetchEnrolledCourses(userId)).unwrap();
      navigate('/dashboard');
    } catch (err) {
      console.error('Post-payment error:', err);
      navigate('/dashboard');
    }
  };

  const handlePaymentFailure = (error) => {
    console.error('Payment failed:', error);
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
            alt="AMC Banner"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-linear-to-r from-orange-900/95 to-orange-800/70 flex flex-col justify-center px-6 md:px-20 pt-24 pointer-events-none">

            <div className="animate-fade-in-up">
              <span className="bg-orange-500/20 text-orange-100 border border-orange-400/30 px-4 py-1.5 rounded-full text-sm font-semibold uppercase tracking-wider mb-4 inline-block backdrop-blur-sm">
                International Medical Graduate
              </span>
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
                <h1 className="text-4xl md:text-6xl font-bold text-white">
                  {course?.name || 'AMC Course'}
                </h1>

              </div>
            </div>
            <p className="text-orange-100 text-lg md:text-xl max-w-2xl animate-fade-in-up delay-100 leading-relaxed">
              {course?.description || 'Comprehensive preparation for the Australian Medical Council exams. Master the concepts with our structured curriculum.'}
            </p>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-20 relative z-10">

        {/* Stats / Info Bar */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 mb-10 flex flex-col md:flex-row md:flex-wrap gap-6 md:gap-8 items-start md:items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">AMC Modules</h2>
            <p className="text-gray-500 text-sm">Targeted preparation for Australia</p>
          </div>

          <div className="flex flex-wrap md:flex-nowrap gap-4 md:gap-6 text-sm font-medium text-gray-600 w-full md:w-auto">
            <div className="flex items-center gap-2 flex-1 md:flex-initial">
              <span className="w-10 h-10 shrink-0 rounded-full bg-orange-50 flex items-center justify-center text-orange-600">
                <FiGlobe className="w-5 h-5" />
              </span>
              <div>
                <div className="font-bold text-gray-900">{subjects.length}</div>
                <div className="text-xs">Subjects</div>
              </div>
            </div>
            <div className="flex items-center gap-2 flex-1 md:flex-initial">
              <span className="w-10 h-10 shrink-0 rounded-full bg-orange-50 flex items-center justify-center text-orange-600">
                <FiTarget className="w-5 h-5" />
              </span>
              <div>
                <div className="font-bold text-gray-900">High Yield</div>
                <div className="text-xs">Content</div>
              </div>
            </div>
          </div>
        </div>

        {/* Interactive Preference Selection Table */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 mb-10">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Why Choose Fornix?</h2>
            <p className="text-gray-600">Select your preferences and see how we compare</p>
          </div>

          {/* Comparison Table */}
          <div className="overflow-x-auto -mx-4 sm:mx-0 px-4 sm:px-0">
            <table className="w-full border-collapse min-w-[700px]">
              <thead>
                <tr className="border-b-2 border-gray-200">
                  <th className="text-left py-4 px-4 font-bold text-lg text-gray-900">Features</th>
                  <th className="text-center py-4 px-4 font-bold text-lg text-orange-600">FORNIX</th>
                  <th className="text-center py-4 px-4 font-bold text-lg text-gray-900">Others</th>
                  <th className="text-center py-4 px-4 font-bold text-lg text-orange-600">My Choice</th>
                </tr>
              </thead>
              <tbody>
                {features.map((feature, index) => (
                  <tr
                    key={feature.id}
                    className={`border-b border-gray-100 hover:bg-orange-50/30 transition-colors ${index % 2 === 0 ? 'bg-gray-50/50' : 'bg-white'
                      }`}
                  >
                    <td className="py-4 px-4 text-gray-800 font-medium">{feature.name}</td>
                    <td className="py-4 px-4 text-center text-gray-700">{feature.fornix}</td>
                    <td className="py-4 px-4 text-center text-gray-600">{feature.others}</td>
                    <td className="py-4 px-4">
                      <div className="flex items-center justify-center gap-3">
                        <button
                          onClick={() => handlePreferenceSelect(feature.id, 'agree')}
                          className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 ${preferences[feature.id] === 'agree'
                            ? 'bg-green-500 text-white shadow-lg scale-110'
                            : 'bg-gray-100 text-gray-400 hover:bg-green-100 hover:text-green-500'
                            }`}
                          aria-label="Agree"
                        >
                          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                          </svg>
                        </button>
                        <button
                          onClick={() => handlePreferenceSelect(feature.id, 'disagree')}
                          className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 ${preferences[feature.id] === 'disagree'
                            ? 'bg-red-500 text-white shadow-lg scale-110'
                            : 'bg-gray-100 text-gray-400 hover:bg-red-100 hover:text-red-500'
                            }`}
                          aria-label="Disagree"
                        >
                          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Enroll Button */}
          <div className="mt-8 text-center">
            <button
              onClick={handleEnrollClick}
              disabled={!allSelected}
              className={`px-8 py-4 rounded-xl font-bold text-lg transition-all duration-300 ${allSelected
                ? 'bg-linear-to-r from-orange-600 to-orange-700 text-white shadow-lg hover:shadow-xl hover:scale-105 cursor-pointer'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                }`}
            >
              {allSelected ? 'Get Course Now →' : 'Select All Preferences to Continue'}
            </button>
            {!allSelected && (
              <p className="text-sm text-gray-500 mt-3">
                Please select your preference for all features above
              </p>
            )}
          </div>
        </div>

        {/* University Exams Section */}
        <UniversityExamsSection courseId={COURSE_ID} />

        {/* Highlighted Mock Tests Section */}
        {!mockTestsLoading && mockTests.length > 0 && (
          <div className="bg-linear-to-r from-orange-500 via-orange-600 to-orange-700 rounded-3xl shadow-2xl p-8 mb-10 relative overflow-hidden">
            {/* Decorative Elements */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32 pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full -ml-24 -mb-24 pointer-events-none"></div>

            <div className="relative z-10">
              {/* Header */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                <div className="flex items-start md:items-center gap-4">
                  <div className="bg-white/20 backdrop-blur-sm p-4 rounded-2xl">
                    <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <div>
                    <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-1 flex items-center gap-2">
                      <FiTarget /> Practice Mock Tests
                    </h2>
                    <p className="text-white/90 text-lg font-medium">
                      {mockTests.length} Mock Test{mockTests.length > 1 ? 's' : ''} Available • Test Your Knowledge Now!
                    </p>
                  </div>
                </div>

                <div className="bg-white/20 backdrop-blur-sm px-6 py-3 rounded-full border-2 border-white/30 self-start md:self-auto">
                  <span className="text-white font-bold text-lg flex items-center gap-2">
                    <FiZap /> Limited Time Access
                  </span>
                </div>
              </div>

              {/* Benefits */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                  <div className="flex items-center gap-3">
                    <div className="bg-white/20 p-2 rounded-lg">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-white font-bold">Timed Practice</p>
                      <p className="text-white/80 text-sm">Real exam simulation</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                  <div className="flex items-center gap-3">
                    <div className="bg-white/20 p-2 rounded-lg">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-white font-bold">Track Progress</p>
                      <p className="text-white/80 text-sm">Monitor your scores</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                  <div className="flex items-center gap-3">
                    <div className="bg-white/20 p-2 rounded-lg">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-white font-bold">Instant Results</p>
                      <p className="text-white/80 text-sm">Detailed analysis</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Mock Tests List */}
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 mb-6 border border-white/20">
                <h3 className="text-white font-bold text-xl mb-4">Available Tests:</h3>
                <div className="space-y-3">
                  {mockTests.slice(0, 3).map((test) => (
                    <div key={test.id} className="bg-white/10 rounded-xl p-4 flex flex-col md:flex-row md:items-center justify-between hover:bg-white/20 transition-all gap-4">
                      <div className="flex-1">
                        <h4 className="text-white font-bold text-lg">{test.title}</h4>
                        <p className="text-white/80 text-sm">{test.description}</p>
                        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-2 text-white/90 text-sm">
                          <span className="flex items-center gap-1"><FiFileText /> {test.total_questions} Questions</span>
                          <span className="flex items-center gap-1"><FiClock /> {test.duration_minutes} Minutes</span>
                          {test.attempts_count > 0 && (
                            <span className="bg-white/20 flex items-center gap-1 px-2 py-1 rounded">
                              <FiCheckCircle /> Attempted {test.attempts_count} time{test.attempts_count > 1 ? 's' : ''}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="relative pointer-events-none w-full md:w-auto mt-2 md:mt-0">

                        <button
                          // onClick={() => handleStartMockTest(test)}
                          onClick={() => {
                            handleStartMockTest(test);
                          }}

                          className={`w-full md:w-auto font-bold px-6 py-3 rounded-xl
             shadow-lg hover:shadow-xl transform hover:scale-105
             transition-all duration-300 flex items-center justify-center gap-2
             relative z-[100] pointer-events-auto ${!canAccessCourse(activeUser, COURSE_ID)
                              ? 'bg-gray-300 text-gray-600 cursor-not-allowed'
                              : 'bg-white text-orange-600 hover:bg-orange-50'
                            }`}
                        >

                          {!canAccessCourse(activeUser, COURSE_ID) ? (
                            <>
                              <svg className="w-5 h-5 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                              </svg>
                              Unlock to Access
                            </>
                          ) : (
                            <>
                              <svg className="w-5 h-5 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                              Start Test
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  ))}
                  {mockTests.length > 3 && (
                    <p className="text-white/80 text-center text-sm">
                      + {mockTests.length - 3} more test{mockTests.length - 3 > 1 ? 's' : ''} available
                    </p>
                  )}
                </div>
              </div>

              {/* CTA Button */}
              <div className="text-center">
                <p className="text-white/90 text-lg mb-4 font-semibold">
                  Select a test below and click "Start Test" to begin
                </p>
                <p className="text-white/80 text-sm">
                  <span className="flex items-center gap-1.5 justify-center mt-1"><LuLightbulb className="text-yellow-300 w-5 h-5 flex-shrink-0" /> Tip: Take mock tests regularly to improve your exam performance</span>
                </p>
              </div>
            </div>
          </div>
        )}

        {/* PYT (Previous Year Topics) Section */}
        <div className="bg-linear-to-r from-orange-600 via-orange-500 to-orange-400 rounded-3xl shadow-2xl p-8 mb-10 relative overflow-hidden">
          {/* Decorative Elements */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full -ml-24 -mb-24"></div>

          <div className="relative z-10">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
              <div className="flex items-start md:items-center gap-4">
                <div className="bg-white/20 backdrop-blur-sm p-4 rounded-2xl shrink-0">
                  <svg className="w-8 h-8 md:w-10 md:h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-2xl md:text-4xl font-extrabold text-white mb-1 flex flex-wrap items-center gap-2">
                    <FiBook /> Previous Year Topics (PYT)
                  </h2>
                  <p className="text-white/90 text-sm md:text-lg font-medium">
                    Practice questions from previous years organized by subject
                  </p>
                </div>
              </div>

              <div className="bg-white/20 backdrop-blur-sm px-6 py-3 rounded-full border-2 border-white/30 self-start md:self-auto">
                <span className="text-white font-bold text-base md:text-lg flex items-center gap-2">
                  <FaGraduationCap /> Year-wise Practice
                </span>
              </div>
            </div>

            {/* Benefits */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                <div className="flex items-center gap-3">
                  <div className="bg-white/20 p-2 rounded-lg">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-white font-bold">Year-wise Topics</p>
                    <p className="text-white/80 text-sm">Organized by year</p>
                  </div>
                </div>
              </div>

              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                <div className="flex items-center gap-3">
                  <div className="bg-white/20 p-2 rounded-lg">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-white font-bold">Subject-wise</p>
                    <p className="text-white/80 text-sm">Browse by subject</p>
                  </div>
                </div>
              </div>

              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                <div className="flex items-center gap-3">
                  <div className="bg-white/20 p-2 rounded-lg">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-white font-bold">Real Questions</p>
                    <p className="text-white/80 text-sm">From past exams</p>
                  </div>
                </div>
              </div>
            </div>

            {/* CTA Button */}
            <div className="text-center w-full">
              <button
                onClick={() => navigate(`/courses/${COURSE_ID}/pyt`)}
                className="bg-white text-orange-600 font-bold px-8 py-4 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 inline-flex items-center justify-center gap-3 w-full md:w-auto"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
                Browse PYT Subjects
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </button>
              <p className="text-white/90 text-sm mt-4">
                <span className="flex items-center gap-1.5 justify-center mt-1"><LuLightbulb className="text-yellow-300 w-5 h-5 flex-shrink-0" /> Practice previous year questions to understand exam patterns</span>
              </p>
            </div>
          </div>
        </div>

        {/* Podcasts Section */}
        {!podcastsLoading && podcastSubjects.length > 0 && (
          <div className="bg-linear-to-r from-orange-500 via-orange-600 to-orange-700 rounded-3xl shadow-2xl p-8 mb-10 relative overflow-hidden">
            {/* Decorative Elements */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full -ml-24 -mb-24"></div>

            <div className="relative z-10">
              {/* Header */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                <div className="flex items-start md:items-center gap-4">
                  <div className="bg-white/20 backdrop-blur-sm p-4 rounded-2xl shrink-0">
                    <svg className="w-8 h-8 md:w-10 md:h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                    </svg>
                  </div>
                  <div>
                    <h2 className="text-2xl md:text-4xl font-extrabold text-white mb-1 flex flex-wrap items-center gap-2">
                      <FiHeadphones /> Medical Podcasts
                    </h2>
                    <p className="text-white/90 text-sm md:text-lg font-medium">
                      Listen to expert explanations and clinical discussions
                    </p>
                  </div>
                </div>

                <div className="bg-white/20 backdrop-blur-sm px-6 py-3 rounded-full border-2 border-white/30 self-start md:self-auto">
                  <span className="text-white font-bold text-base md:text-lg flex items-center gap-2">
                    <FiMic /> {podcastSubjects.length} Subject{podcastSubjects.length > 1 ? 's' : ''}
                  </span>
                </div>
              </div>

              {/* Benefits */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                  <div className="flex items-center gap-3">
                    <div className="bg-white/20 p-2 rounded-lg">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-white font-bold">Audio Learning</p>
                      <p className="text-white/80 text-sm">Learn on the go</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                  <div className="flex items-center gap-3">
                    <div className="bg-white/20 p-2 rounded-lg">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-white font-bold">Expert Insights</p>
                      <p className="text-white/80 text-sm">Clinical pearls</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                  <div className="flex items-center gap-3">
                    <div className="bg-white/20 p-2 rounded-lg">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-white font-bold">Flexible</p>
                      <p className="text-white/80 text-sm">Study anytime</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Podcast Subjects Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                {podcastSubjects.map((subject) => (
                  <div key={subject.id} className="space-y-3">
                    <div
                      onClick={() => handlePodcastSubjectClick(subject)}
                      className="bg-white/10 backdrop-blur-sm rounded-xl p-5 border border-white/20 hover:bg-white/20 transition-all cursor-pointer group"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center text-white font-bold text-xl group-hover:scale-110 transition-transform">
                          {subject.name.charAt(0)}
                        </div>
                        <span className="bg-white/20 text-white px-3 py-1 rounded-full text-xs font-bold">
                          {subject.podcasts_count} Podcast{subject.podcasts_count > 1 ? 's' : ''}
                        </span>
                      </div>
                      <h4 className="text-white font-bold text-lg mb-2 line-clamp-1">{subject.name}</h4>
                      {subject.description && (
                        <p className="text-white/80 text-sm line-clamp-2 mb-3">{subject.description}</p>
                      )}
                      <div className="flex items-center text-white font-semibold text-sm group-hover:translate-x-1 transition-transform">
                        {selectedPodcastSubject === subject.id ? '▼ Hide' : '▶ View'} Podcasts
                        <svg className="w-4 h-4 ml-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                        </svg>
                      </div>
                    </div>

                    {/* Podcasts List - Expandable */}
                    {selectedPodcastSubject === subject.id && (
                      <div className="space-y-3 pl-4">
                        {podcastsLoadingBySubject ? (
                          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-5 border border-white/20 text-center">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-2"></div>
                            <p className="text-white/80 text-sm">Loading podcasts...</p>
                          </div>
                        ) : currentPodcasts.length > 0 ? (
                          currentPodcasts.map((podcast) => (
                            <PodcastPlayer key={podcast.id} podcast={podcast} />
                          ))
                        ) : (
                          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-5 border border-white/20 text-center">
                            <p className="text-white/80 text-sm">No podcasts available</p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* CTA */}
              <div className="text-center">
                <p className="text-white/90 text-sm">
                  <span className="flex items-center gap-1.5 justify-center mt-1"><LuLightbulb className="text-yellow-300 w-5 h-5 flex-shrink-0" /> Click on any subject to explore available podcasts</span>
                </p>
              </div>
            </div>
          </div>
        )}

        {subjects.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl shadow-sm border border-gray-100">
            <div className="bg-gray-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke Linecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">No Content Available</h3>
            <p className="text-gray-500">Subjects are currently being updated.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
            {subjects.map((subject) => (
              <div
                key={subject.id}
                onClick={() => handleSubjectClick(subject)}
                className={`group bg-white rounded-2xl p-6 hover:shadow-xl transition-all duration-300 cursor-pointer border border-gray-100 hover:border-orange-200 relative overflow-hidden ${!canAccessCourse(activeUser, COURSE_ID) ? 'opacity-75' : ''}`}
              >
                <div className="absolute top-0 right-0 w-24 h-24 bg-linear-to-br from-orange-50 to-transparent rounded-bl-full opacity-50 group-hover:scale-110 transition-transform -mr-4 -mt-4"></div>

                {/* Lock Icon for locked courses */}
                {!canAccessCourse(activeUser, COURSE_ID) && (
                  <div className="absolute top-3 right-3 w-8 h-8 bg-gray-900/80 backdrop-blur-sm rounded-full flex items-center justify-center z-20">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                )}

                <div className="relative z-10">
                  <div className="flex items-start justify-between mb-6">
                    <div className="w-14 h-14 bg-linear-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-orange-200 group-hover:scale-110 transition-transform duration-300 overflow-hidden">
                      {(subject.image || subject.logo || subject.icon) ? (
                        <img
                          src={subject.image || subject.logo || subject.icon}
                          alt={subject.name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.target.style.display = 'none';
                            e.target.parentNode.children[1].style.display = 'block';
                          }}
                        />
                      ) : null}
                      <span className={`text-2xl font-bold ${(subject.image || subject.logo || subject.icon) ? 'hidden' : ''}`} style={{ display: (subject.image || subject.logo || subject.icon) ? 'none' : 'block' }}>
                        {formatSubjectName(subject.name).charAt(0)}
                      </span>
                    </div>
                    <ChapterCountDisplay subject={subject} />
                  </div>

                  <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-orange-600 transition-colors line-clamp-1">
                    {formatSubjectName(subject.name)}
                  </h3>

                  <p className="text-gray-600 text-sm line-clamp-2 mb-6 h-10 leading-relaxed">
                    {subject.description || 'Comprehensive study modules covering key concepts and problem-solving techniques.'}
                  </p>

                  {/* <div className="flex items-center justify-between gap-3">
                    <div 
                      className="flex items-center text-orange-600 font-bold text-sm group-hover:translate-x-1 transition-transform"
                    >
                      {!canAccessCourse(activeUser, COURSE_ID) ? 'Unlock to Access' : 'Start Learning'}
                      <svg className="w-4 h-4 ml-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                    </div>

                    {canAccessCourse(activeUser, COURSE_ID) && (
                      // <button
                      //   onClick={(e) => handlePracticeClick(e, subject)}
                      //   className="bg-orange-100 text-orange-700 px-4 py-2 rounded-xl text-xs font-bold hover:bg-orange-600 hover:text-white transition-all shadow-sm flex items-center gap-1.5"
                      // >
                      //   ⚡ Practice Set
                      // </button>
                    )}
                  </div> */}
                </div>
              </div>
            ))}
          </div>
        )}

        <SubjectQuizModal
          isOpen={isSubjectModalOpen}
          onClose={() => setIsSubjectModalOpen(false)}
          subject={selectedSubjectQuiz}
        />

        {/* Discussions Section */}
        {!discussionsLoading && discussions.length > 0 && (
          <div className="bg-linear-to-r from-orange-600 via-orange-500 to-orange-400 rounded-3xl shadow-2xl p-8 mb-10 relative overflow-hidden">
            {/* Decorative Elements */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full -ml-24 -mb-24"></div>

            <div className="relative z-10">
              {/* Header */}
              <div className="flex items-center justify-between flex-wrap gap-4 mb-6">
                <div className="flex items-center gap-4">
                  <div className="bg-white/20 backdrop-blur-sm p-4 rounded-2xl">
                    <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
                    </svg>
                  </div>
                  <div>
                    <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-1 flex items-center gap-2">
                      <FiMessageCircle /> Discussion Groups
                    </h2>
                    <p className="text-white/90 text-lg font-medium">
                      Join expert-led discussions and collaborate with peers
                    </p>
                  </div>
                </div>

                <div className="bg-white/20 backdrop-blur-sm px-6 py-3 rounded-full border-2 border-white/30">
                  <span className="text-white font-bold text-lg flex items-center gap-2">
                    <FiUsers /> {discussions.length} Group{discussions.length > 1 ? 's' : ''}
                  </span>
                </div>
              </div>

              {/* Benefits */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                  <div className="flex items-center gap-3">
                    <div className="bg-white/20 p-2 rounded-lg">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-white font-bold">Expert Doctors</p>
                      <p className="text-white/80 text-sm">Learn from specialists</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                  <div className="flex items-center gap-3">
                    <div className="bg-white/20 p-2 rounded-lg">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-white font-bold">Active Discussions</p>
                      <p className="text-white/80 text-sm">Real-time Q&A</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                  <div className="flex items-center gap-3">
                    <div className="bg-white/20 p-2 rounded-lg">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-white font-bold">Peer Learning</p>
                      <p className="text-white/80 text-sm">Collaborate & grow</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Discussions Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                {discussions.map((discussion) => (
                  <DiscussionCard key={discussion.id} discussion={discussion} />
                ))}
              </div>

              {/* CTA */}
              <div className="text-center">
                <p className="text-white/90 text-sm">
                  <span className="flex items-center gap-1.5 justify-center mt-1"><LuLightbulb className="text-yellow-300 w-5 h-5 flex-shrink-0" /> Click "Join Discussion" to participate in expert-led conversations</span>
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Pricing Section (Floating Style Cards) */}
        {!loading && (
          <div id="pricing" className="mb-20" ref={pricingSectionRef}>
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-5xl font-extrabold text-orange-900 mb-4">Pricing Plans</h2>
              <p className="text-gray-500 text-lg">Choose the right plan based on your preparation timeline.</p>

            </div>
            <div className="text-center mb-12">
              <p className="text-gray-500 text-lg">We strongly recommend that you review the sample content / free trial before purchasing any plan</p>

            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative">
              {/* Filter plans for this course */}
              {(plans.filter(p => p.course_id === COURSE_ID).length > 0 ? [...plans.filter(p => p.course_id === COURSE_ID)] : [...(course?.plans || [])])
                .sort((a, b) => {
                  const getDuration = (p) => {
                    if (p.duration_months) return parseInt(p.duration_months);
                    const match = (p.name || '').match(/(\d+)\s*(Month|Year)/i);
                    if (match) {
                      const val = parseInt(match[1]);
                      if (match[2].toLowerCase().startsWith('year')) return val * 12;
                      return val;
                    }
                    return p.price || 999;
                  };
                  return getDuration(a) - getDuration(b);
                })
                .map((plan, idx) => {
                  const styles = [
                    {
                      color: 'blue',
                      bgHeader: 'bg-orange-500',
                      textHeader: '1 Month Plan',
                      subtext: 'Ideal for quick revision & practice',
                      priceColor: 'text-orange-600',
                      btnColor: 'bg-linear-to-r from-orange-500 to-orange-600 shadow-orange-200',

                    },
                    {
                      color: 'purple',
                      bgHeader: 'bg-orange-600',
                      textHeader: '3 Months Plan',
                      subtext: 'Best for complete preparation',
                      priceColor: 'text-orange-600',
                      btnColor: 'bg-linear-to-r from-orange-500 to-orange-600 shadow-orange-200'
                    },
                    {
                      color: 'orange',
                      bgHeader: 'bg-orange-500',
                      textHeader: '6 Months Plan',
                      subtext: 'Ideal for thorough and smart preparation',
                      priceColor: 'text-orange-600',
                      badge: 'Best Value',
                      btnColor: 'bg-linear-to-r from-orange-400 to-orange-600 shadow-orange-200'
                    },
                    {
                      color: 'teal',
                      bgHeader: 'bg-orange-600',
                      textHeader: '1 Year Plan',
                      subtext: 'Best value for long term learning',
                      priceColor: 'text-orange-600',
                      badge: 'Premium',
                      btnColor: 'bg-linear-to-r from-orange-500 to-orange-600 shadow-orange-200'
                    }
                  ];

                  const style = styles[idx % styles.length];

                  // User ID logic
                  const uid = (() => {
                    let id = user?.user_id || user?.uuid || user?.id;
                    if (!id || !isValidUUID(id)) return '0c8a7950-df05-47e2-881f-5116b762ad5e';
                    return id;
                  })();

                  return (
                    <div key={plan.id} className="relative group bg-white rounded-2xl shadow-xl overflow-hidden transform hover:-translate-y-2 transition-all duration-300 border border-gray-100 flex flex-col h-full">
                      {/* Badge */}
                      {style.badge && (
                        <div className={`absolute top-0 right-0 ${style.bgHeader} text-white text-xs font-bold px-3 py-1 rounded-bl-lg z-10 shadow-md`}>
                          {style.badge}
                        </div>
                      )}

                      {/* Header */}
                      <div className={`${style.bgHeader} p-4 text-center text-white relative overflow-hidden`}>
                        <div className="absolute top-0 left-0 w-full h-full bg-white/10 skew-y-6 transform origin-bottom-left"></div>
                        <h3 className="text-2xl font-bold relative z-10">{plan.name || style.textHeader}</h3>
                      </div>

                      {/* Subheader */}
                      <div className={`bg-${style.color}-50 p-2 text-center border-b border-${style.color}-100`}>
                        <p className={`text-${style.color}-800 text-xs font-semibold`}>{style.subtext}</p>
                      </div>

                      {/* Features */}
                      <div className="p-6 flex-1">
                        <ul className="space-y-3 text-sm text-gray-600">
                          {[
                            "Q Bank (7000+ Clinical Questions)",
                            "Mock Tests",
                            "AI Doubt Solver (24/7)",
                            "High Yield Notes",
                            "Advanced Analytics",
                            "FREE Updates During Validity"
                          ].map((feat, i) => (
                            <li key={i} className="flex items-start gap-2">
                              <svg className={`w-5 h-5 ${style.priceColor} shrink-0`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                              </svg>
                              <span>{feat}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Price */}
                      <div className="px-6 py-4 text-center bg-gray-50 border-t border-gray-100">
                        <div className="flex items-center justify-center gap-2 mb-1">
                          <span className="text-gray-400 line-through text-sm">₹{plan.original_price || Math.round(plan.price * 1.5)}</span>
                          <span className={`text-3xl font-extrabold ${style.priceColor}`}>₹{plan.price}</span>
                        </div>
                        {plan.price > 0 && (
                          <p className="text-xs text-orange-500 font-bold mb-4">(Limited Offer)</p>
                        )}
                        {/* Validty */}
                        <p className="text-xs text-gray-500 mb-4">Validity: {(() => {
                          if (plan.duration_months) return plan.duration_months;
                          const match = (plan.name || '').match(/(\d+)\s*(Month|Year)/i);
                          if (match) {
                            const val = parseInt(match[1]);
                            if (match[2].toLowerCase().startsWith('year')) return val * 12;
                            return val;
                          }
                          return '?';
                        })()} Months</p>

                        <RazorpayCheckout
                          amount={plan.price}
                          currency="INR"
                          courseId={COURSE_ID}
                          planId={plan.id}
                          planName={plan.name}
                          userId={uid}
                          userEmail={user?.email}
                          userPhone={user?.phone}
                          userName={user?.name || user?.full_name}
                          onSuccess={handlePaymentSuccess}
                          onFailure={handlePaymentFailure}
                          buttonText="Buy Now"
                          buttonClassName={`w-full ${style.btnColor} text-white font-bold py-3 px-6 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300`}
                        />
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        )}
      </div>

      {/* Upgrade Prompt Modal */}
      <UpgradePrompt
        isOpen={showUpgradePrompt}
        onClose={() => setShowUpgradePrompt(false)}
        feature={upgradeFeature}
        user={user}
        courseId={COURSE_ID}
        courseName="AMC"
      />
    </div>
  );
}

export default AMC;

