import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUserProfile, selectUser } from './redux/slices/authSlice';
import { requestNotificationPermission, listenForMessages } from "./Components/FirebaseNotifications.jsx";
import ScrollToTop from './Components/ScrollToTop.jsx';
import Home from '../src/Pages/Home.jsx'
import About from '../src/Pages/About.jsx';
import ContactUs from '../src/Pages/ContactUs.jsx';
import Footer from './Components/Footer.jsx';
import Headers from './Components/Header.jsx';
import Login from '../src/Pages/Login.jsx';
import ForgotPassword from '../src/Pages/ForgotPassword.jsx';
import SignUp from '../src/Pages/SignUp.jsx';
import Dashboard from '../src/Pages/Dashboard.jsx';
import ProfilePage from '../src/Pages/ProfilePage.jsx';
import SubjectsPage from '../src/Pages/SubjectsPage.jsx';
import ChaptersPage from '../src/Pages/ChaptersPage.jsx';
import TopicsPage from '../src/Pages/TopicsPage.jsx';
import QuizStart from '../src/Pages/QuizStart.jsx';
import QuizTakingPage from '../src/Pages/QuizTakingPage.jsx';
import QuizResultsPage from '../src/Pages/QuizResultsPage.jsx';
import QuizHistoryPage from '../src/Pages/QuizHistoryPage.jsx';
import RankingsPage from '../src/Pages/RankingsPage.jsx';
import NotesPage from '../src/Pages/NotesPage.jsx';
import AMC from '../src/Pages/AMC.jsx';
import NeetUg from '../src/Pages/NeetUG.jsx';
import NeetPg from '../src/Pages/NeetPg.jsx';
import ProtectedRoute from './Components/ProtectedRoute.jsx';
import NotificationContainer from './Components/NotificationContainer.jsx';
import PLAB from '../src/Pages/PLAB.jsx';
import FMGE from '../src/Pages/FMGE.jsx';
import PricingPage from '../src/Pages/PricingPage.jsx';
import PYTSubjects from '../src/Pages/PYTSubjects.jsx';
import PYTTopics from '../src/Pages/PYTTopics.jsx';
import DiscussionPostsPage from '../src/Pages/DiscussionPostsPage.jsx';
import SmartTrackingPage from '../src/Pages/SmartTrackingPage.jsx';
import ChatWidget from './Components/ChatWidget.jsx';
import EnrollmentPage from '../src/Pages/EnrollmentPage.jsx';
import TermsAndConditions from '../src/Pages/TermsAndConditions.jsx';
import PrivacyPolicies from '../src/Pages/PrivacyPolicies.jsx';
import RefundPolicy from '../src/Pages/RefundPolicy.jsx';
import UniversityExamInstructionsPage from '../src/Pages/UniversityExamInstructionsPage.jsx';
import UniversityExamTakingPage from '../src/Pages/UniversityExamTakingPage.jsx';
import UniversityExamResultPage from '../src/Pages/UniversityExamResultPage.jsx';

function App() {
  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  const token = localStorage.getItem('token');

  // notification

  useEffect(() => {
  listenForMessages();
}, []);

useEffect(() => {
  if (user?.id) {
    requestNotificationPermission(user.id);
  }
}, [user]);


  useEffect(() => {
    // Restore user session if token exists but user is null
    if (token && !user) {
      dispatch(fetchUserProfile());
    }
  }, [dispatch, token, user]);

  // Global protection against screenshots, printing, and right-clicks
  useEffect(() => {
    // Disable right-click context menu
    const handleContextMenu = (e) => {
      e.preventDefault();
      return false;
    };

    // Disable common screenshot / dev tools shortcuts
    const handleKeyDown = (e) => {
      // 123 is F12, 44 is PrintScreen, etc.
      if (
        e.key === 'PrintScreen' ||
        e.keyCode === 44 ||
        e.keyCode === 123 ||
        (e.ctrlKey && e.shiftKey && e.keyCode === 73) || // Ctrl+Shift+I
        (e.ctrlKey && e.shiftKey && e.keyCode === 74) || // Ctrl+Shift+J
        (e.ctrlKey && e.keyCode === 85) || // Ctrl+U
        (e.ctrlKey && e.keyCode === 80) || // Ctrl+P
        (e.metaKey && e.shiftKey && (e.key === '3' || e.key === '4' || e.key === '5')) // Mac screenshot keys
      ) {
        e.preventDefault();
        return false;
      }
    };

    const handleKeyUp = (e) => {
      if (e.key === 'PrintScreen' || e.keyCode === 44) {
        // Some browsers fire print screen on key up
        try {
          if (document.hasFocus()) {
            navigator.clipboard.writeText(''); // Attempt to clear clipboard
          }
        } catch (err) {
          // Ignore errors
        }
        e.preventDefault();
      }
    };

    // Disable copying and cutting text
    const handleCopyCut = (e) => {
      e.preventDefault();
      try {
        navigator.clipboard.writeText(''); // Ensure clipboard is cleared
      } catch (err) {
        // Ignore errors
      }
      return false;
    };

    document.addEventListener('contextmenu', handleContextMenu);
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('keyup', handleKeyUp);
    document.addEventListener('copy', handleCopyCut);
    document.addEventListener('cut', handleCopyCut);

    return () => {
      document.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('keyup', handleKeyUp);
      document.removeEventListener('copy', handleCopyCut);
      document.removeEventListener('cut', handleCopyCut);
    };
  }, []);

  return (
    <Router>
      <ScrollToTop />
      <NotificationContainer />
      <ChatWidget />
      <Headers />
      {/* <Navbar /> */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<ContactUs />} />
        {/* <Route path="/courses" element={<Courses />} /> */}
        <Route path="/pricing" element={<PricingPage />} />
        <Route path="/terms-and-conditions" element={<TermsAndConditions />} />
        <Route path="/privacy-policy" element={<PrivacyPolicies />} />
        <Route path="/refund-policy" element={<RefundPolicy />} />
        <Route path="/enroll/:courseId" element={
          <ProtectedRoute>
            <EnrollmentPage />
          </ProtectedRoute>
        } />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />\r
        <Route path="/forgot-password" element={<ForgotPassword />} />


        {/* Protected Routes - Require Authentication */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/smart-tracking"
          element={
            <ProtectedRoute>
              <SmartTrackingPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          }
        />

        {/* Protected Course Routes - Require Authentication */}
        <Route path="/courses/:courseId/subjects" element={
          <ProtectedRoute>
            <SubjectsPage />
          </ProtectedRoute>
        } />
        <Route path="/subjects/:subjectId/chapters" element={
          <ProtectedRoute>
            <ChaptersPage />
          </ProtectedRoute>
        } />
        <Route path="/chapters/:chapterId/topics" element={
          <ProtectedRoute>
            <TopicsPage />
          </ProtectedRoute>
        } />
        <Route path="/courses/amc" element={
          <ProtectedRoute>
            <AMC />
          </ProtectedRoute>
        } />
        <Route path="/courses/neet-ug" element={
          <ProtectedRoute>
            <NeetUg />
          </ProtectedRoute>
        } />
        <Route path="/courses/neet-pg" element={
          <ProtectedRoute>
            <NeetPg />
          </ProtectedRoute>
        } />
        <Route path="/courses/plab" element={
            <PLAB />
        } />
        <Route path="/courses/FMGE" element={
          <ProtectedRoute>
            <FMGE />
          </ProtectedRoute>
        } />
        <Route path="/courses/:courseId/pyt" element={
          <ProtectedRoute>
            <PYTSubjects />
          </ProtectedRoute>
        } />
        <Route path="/pyt/:subjectId/topics" element={
          <ProtectedRoute>
            <PYTTopics />
          </ProtectedRoute>
        } />
        <Route path="/discussions/:discussionId" element={
          <ProtectedRoute>
            <DiscussionPostsPage />
          </ProtectedRoute>
        } />

        {/* Protected Quiz Routes */}
        <Route
          path="/quiz/start"
          element={
            <ProtectedRoute>
              <QuizStart />
            </ProtectedRoute>
          }
        />
        <Route
          path="/quiz/taking/:quizId"
          element={
            <ProtectedRoute>
              <QuizTakingPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/quiz/results/:quizId"
          element={
            <ProtectedRoute>
              <QuizResultsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/quiz/history"
          element={
            <ProtectedRoute>
              <QuizHistoryPage />
            </ProtectedRoute>
          }
        />
        <Route path="/rankings" element={<RankingsPage />} />

        {/* Protected University Exam Routes */}
        <Route
          path="/university-exams/:examId/instructions"
          element={
            <ProtectedRoute>
              <UniversityExamInstructionsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/university-exams/:examId/taking"
          element={
            <ProtectedRoute>
              <UniversityExamTakingPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/university-exams/:examId/result"
          element={
            <ProtectedRoute>
              <UniversityExamResultPage />
            </ProtectedRoute>
          }
        />

        {/* Protected Notes Routes */}
        <Route path="/notes" element={
          <ProtectedRoute>
            <NotesPage />
          </ProtectedRoute>
        } />
        <Route path="/notes/:topicId" element={
          <ProtectedRoute>
            <NotesPage />
          </ProtectedRoute>
        } />
      </Routes>
      <Footer />
    </Router>
  )

}


export default App
