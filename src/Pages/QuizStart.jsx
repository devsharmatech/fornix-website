import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  fetchChapterQuiz,
  fetchTopicQuiz,
  startMultiChapterQuiz,
  selectQuizLoading,
} from "../redux/slices/quizSlice";
import { selectUser } from "../redux/slices/authSlice";
import { selectUserProfile, fetchUserDetails } from "../redux/slices/userSlice";
import { showNotification } from "../redux/slices/uiSlice";
import UpgradePrompt from "../Components/UpgradePrompt";
import QuizAttemptsCounter from "../Components/QuizAttemptsCounter";
import { canAttemptQuiz, getUsedQuizAttempts, trackQuizAttempt, isActiveSubscriber } from "../utils/accessControl";

function QuizStart() {
  const [searchParams] = useSearchParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const user = useSelector(selectUser);
  const userProfile = useSelector(selectUserProfile);
  const loading = useSelector(selectQuizLoading);

  // Use profile if available, otherwise fall back to auth user
  const activeUser = userProfile || user;

  // Fetch full user profile if we only have basic auth info
  React.useEffect(() => {
    if (user?.user_id && !userProfile) {
      dispatch(fetchUserDetails(user.user_id));
    } else if (user?.id && !userProfile) {
      dispatch(fetchUserDetails(user.id));
    }
  }, [dispatch, user, userProfile]);

  const chapterId = searchParams.get("chapterId");
  const topicIds = searchParams.get("topicIds")?.split(",");
  const multiChapterIds = searchParams.get("multiChapterIds")?.split(",");
  const mockTestId = searchParams.get("mockTestId");
  const isMockTest = searchParams.get("type") === "mock" || mockTestId;

  const [quizConfig, setQuizConfig] = useState({
    limit: 20,
    questionType: "Easy",
  });

  // Upgrade Prompt State
  const [showUpgradePrompt, setShowUpgradePrompt] = useState(false);

  const courseId = null; // Could be passed via searchParams if needed

  const handleStartQuiz = async () => {
    if (!activeUser) {
      dispatch(
        showNotification({
          type: "warning",
          message: "Please login to start a test",
        }),
      );
      navigate("/login");
      return;
    }

    // Check quiz access for non-mock tests
    if (!mockTestId && !canAttemptQuiz(activeUser, courseId)) {
      setShowUpgradePrompt(true);
      return;
    }

    try {
      let result;

      if (mockTestId) {
        // Handle mock test - navigate to mock test taking page
        navigate(`/quiz/taking/${mockTestId}`);
        return;
      } else if (multiChapterIds && multiChapterIds.length > 0) {
        // Handle bulk multi-chapter quiz directly formatting Redux store
        result = await dispatch(
          startMultiChapterQuiz({
            chapter_ids: multiChapterIds,
            question_type: quizConfig.questionType,
            limit: quizConfig.limit,
          }),
        ).unwrap();

      } else if (chapterId) {
        // Fetch chapter quiz directly
        result = await dispatch(
          fetchChapterQuiz({
            chapter_id: chapterId,
            question_type: quizConfig.questionType.toLowerCase()
          }),
        ).unwrap();
      } else if (topicIds) {
        // Fetch topic quiz directly
        result = await dispatch(
          fetchTopicQuiz({
            topic_ids: Array.isArray(topicIds) ? topicIds : [topicIds],
            question_type: quizConfig.questionType,
            limit: quizConfig.limit,
          }),
        ).unwrap();
      } else if (isMockTest) {
        // Show message to select a mock test
        dispatch(
          showNotification({
            type: "info",
            message: "Please select a mock test from the course page",
          }),
        );
        navigate(-1);
        return;
      } else {
        // No chapter or topics selected - redirect to courses page
        dispatch(
          showNotification({
            type: "info",
            message: "Please select a course, chapter, or topic to start a test",
          }),
        );
        navigate("/courses");
        return;
      }

      // Track the attempt for free users before navigating
      trackQuizAttempt(activeUser, chapterId || (topicIds ? topicIds[0] : 'topic'));

      // Navigate to quiz taking page
      // Use a temporary ID since we're loading questions directly
      navigate(`/quiz/taking/direct`);
    } catch (error) {
      const errorMessage =
        typeof error === "string"
          ? error
          : error?.message || "Failed to start quiz";
      dispatch(
        showNotification({
          type: "error",
          message: errorMessage,
        }),
      );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-32 pb-12">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-xl shadow-md p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">
            {multiChapterIds ? "Configure Bulk Details" : "Configure Your Test"}
          </h1>

          <div className="space-y-6">
            {/* Number of Questions */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Number of Questions
              </label>
              <select
                value={quizConfig.limit}
                onChange={(e) =>
                  setQuizConfig({
                    ...quizConfig,
                    limit: parseInt(e.target.value),
                  })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
              >
                <option value={10}>10 Questions</option>
                <option value={20}>20 Questions</option>
                <option value={30}>30 Questions</option>
                <option value={50}>50 Questions</option>
              </select>
            </div>

            {/* Difficulty Level */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Difficulty Level
              </label>
              <div className="grid grid-cols-3 gap-3">
                {["Easy", "Moderate", "Difficult"].map((level) => (
                  <button
                    key={level}
                    onClick={() =>
                      setQuizConfig({ ...quizConfig, questionType: level })
                    }
                    className={`py-2 px-4 rounded-lg font-semibold transition ${quizConfig.questionType === level
                      ? "bg-orange-500 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                  >
                    {level.charAt(0).toUpperCase() + level.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            {/* Quiz Info */}
            <div className="bg-orange-50 border-2 border-orange-200 rounded-lg p-4">
              <h3 className="font-semibold text-orange-900 mb-2">
                Test Information
              </h3>
              <ul className="text-sm text-orange-800 space-y-1">
                <li>• {quizConfig.limit} questions will be presented</li>
                <li>• Difficulty: {quizConfig.questionType}</li>
                <li>• You can review your answers after submission</li>
                <li>• Your progress will be tracked</li>
              </ul>
            </div>

            {/* Start Button */}
            <button
              onClick={handleStartQuiz}
              disabled={loading}
              className="w-full bg-orange-500 text-white py-3 rounded-lg font-semibold hover:bg-orange-600 transition disabled:opacity-50"
            >
              {loading ? "Starting Test..." : "Start Test"}
            </button>

            <button
              onClick={() => navigate(-1)}
              className="w-full bg-gray-200 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-300 transition"
            >
              Cancel
            </button>
          </div>
        </div>

        {/* Quiz Attempts Counter for Free Users */}
        {activeUser && !isActiveSubscriber(activeUser) && (
          <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
            <QuizAttemptsCounter
              used={getUsedQuizAttempts(activeUser)}
              total={2}
            />
          </div>
        )}
      </div>

      {/* Upgrade Prompt Modal */}
      <UpgradePrompt
        isOpen={showUpgradePrompt}
        onClose={() => setShowUpgradePrompt(false)}
        feature="quiz"
        user={activeUser}
        courseId={courseId}
      />
    </div>
  );
}

export default QuizStart;
