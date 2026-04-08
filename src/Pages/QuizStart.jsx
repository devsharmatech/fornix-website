import React, { useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  fetchChapterQuiz,
  fetchTopicQuiz,
  startMultiChapterQuiz,
  fetchQuizAvailableStats,
  selectQuizLoading,
  resetAMCQuiz,
} from "../redux/slices/quizSlice";
import { selectUser } from "../redux/slices/authSlice";
import { selectUserProfile, fetchUserDetails } from "../redux/slices/userSlice";
import { showNotification } from "../redux/slices/uiSlice";
import {
  HiAdjustments,
  HiClipboardCheck,
  HiHashtag,
  HiLightBulb,
  HiBadgeCheck,
  HiChartBar,
  HiRefresh,
  HiLightningBolt,
} from "react-icons/hi";
import { FiZap, FiActivity, FiTarget, FiLayers } from "react-icons/fi";
import { BsArrowLeftShort } from "react-icons/bs";
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

  const [quizConfig, setQuizConfig] = useState({
    limit: 20,
    questionType: "Easy",
  });

  const [availableStats, setAvailableStats] = useState({
    easy: null,
    moderate: null,
    difficult: null,
    mixed: null
  });
  const [unattemptedStats, setUnattemptedStats] = useState({
    easy: null,
    moderate: null,
    difficult: null,
    mixed: null
  });
  const [statsLoading, setStatsLoading] = useState(true);

  // Calculate current unattempted count for validation and UI logic
  const unattemptedCount = unattemptedStats[quizConfig.questionType.toLowerCase()];
  const isAllAttempted = unattemptedCount === 0;

  const chapterId = searchParams.get("chapterId");
  const topicIds = searchParams.get("topicIds")?.split(",");
  const multiChapterIds = searchParams.get("multiChapterIds")?.split(",");
  const mockTestId = searchParams.get("mockTestId");
  const isMockTest = searchParams.get("type") === "mock" || mockTestId;

  // Fetch full user profile if we only have basic auth info
  React.useEffect(() => {
    if (user?.user_id && !userProfile) {
      dispatch(fetchUserDetails(user.user_id));
    } else if (user?.id && !userProfile) {
      dispatch(fetchUserDetails(user.id));
    }
  }, [dispatch, user, userProfile]);

  // Fetch available quiz questions stats for the current targets
  const loadStats = useCallback(async () => {
    if (!activeUser) return;

    let payload = {};
    if (chapterId) payload.chapter_id = chapterId;
    else if (topicIds && topicIds.length > 0) payload.topic_ids = Array.isArray(topicIds) ? topicIds : [topicIds];
    else if (multiChapterIds && multiChapterIds.length > 0) payload.multi_chapter_ids = multiChapterIds;
    else {
      setStatsLoading(false);
      return; // Mock or invalid
    }

    try {
      setStatsLoading(true); // Ensure loading state is set
      const result = await dispatch(fetchQuizAvailableStats(payload)).unwrap();
      if (result.success && result.stats) {
        setAvailableStats(result.stats);
        if (result.unattempted) {
           setUnattemptedStats(result.unattempted);
        }
      }
    } catch (err) {
      console.error("Failed to load quiz stats:", err);
    } finally {
      setStatsLoading(false);
    }
  }, [dispatch, activeUser, chapterId, topicIds, multiChapterIds]);

  React.useEffect(() => {
    loadStats();
  }, [loadStats]);

  // Upgrade Prompt State
  const [showUpgradePrompt, setShowUpgradePrompt] = useState(false);

  const courseId = null; // Could be passed via searchParams if needed

  // Function to reset chapter progress
  const handleResetProgress = async () => {
    if (!activeUser || !chapterId) return;

    const confirmed = window.confirm(
      "Are you sure you want to reset your progress for this chapter? This will clear your previous attempts and make all questions 'New' again."
    );

    if (!confirmed) return;

    try {
      setStatsLoading(true);
      const result = await dispatch(resetAMCQuiz({ 
        chapter_id: chapterId,
        user_id: activeUser?.user_id || activeUser?.id 
      })).unwrap();

      if (result.success) {
        dispatch(showNotification({
          type: 'success',
          message: 'Progress reset! All questions are now marked as new.'
        }));
        // Refetch stats to update the UI
        await loadStats();
      }
    } catch (err) {
      console.error("Failed to reset progress:", err);
      dispatch(showNotification({
        type: 'error',
        message: 'Failed to reset progress. Please try again.'
      }));
    } finally {
      setStatsLoading(false);
    }
  };

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

    if (!mockTestId && (quizConfig.limit < 1 || quizConfig.limit > 200 || isNaN(quizConfig.limit))) {
      dispatch(showNotification({ type: "warning", message: "Please enter a valid number of questions between 1 and 200." }));
      return;
    }

    const availableForType = availableStats[quizConfig.questionType.toLowerCase()];
    if (!mockTestId && availableForType !== null && quizConfig.limit > availableForType) {
      dispatch(showNotification({ 
        type: "warning", 
        message: `Only ${availableForType} questions available in ${quizConfig.questionType} mode. Please reduce your limit.` 
      }));
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
            question_type: quizConfig.questionType.toLowerCase(),
            limit: quizConfig.limit
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

      // Save attempt_id and type for session persistence on refresh
      if (result?.attempt_id || result?.id) {
        localStorage.setItem('active_quiz_attempt_id', result.attempt_id || result.id);
        localStorage.setItem('active_quiz_is_mock', 'false');
      }

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
    <div className="min-h-screen bg-slate-50 pt-28 pb-12 sm:pt-32">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Header Area */}
        <div className="mb-6 flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="p-2 bg-white rounded-full shadow-sm hover:shadow-md hover:bg-gray-50 transition-all text-gray-600"
          >
            <BsArrowLeftShort size={24} />
          </button>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 leading-tight">
              {multiChapterIds ? "Configure Bulk Test" : "Configure Custom Quiz"}
            </h1>
            <p className="text-slate-500 text-sm">Select your preferred settings to start the session.</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-100 shadow-xl shadow-slate-200/50 p-6 sm:p-8 overflow-hidden relative">
          {/* Subtle Background Accent */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-orange-50 rounded-full -mr-16 -mt-16 opacity-50 blur-2xl" />

          <div className="space-y-8 relative">
            {/* Number of Questions Section */}
            <div className="relative group">
              <div className="flex items-center gap-2 mb-3">
                <HiHashtag className="text-orange-500" />
                <label className="block text-sm font-semibold text-slate-700">
                  Question Limit (1 - 200)
                </label>
              </div>
              <div className="relative">
                <input
                  type="number"
                  min={1}
                  max={availableStats[quizConfig.questionType.toLowerCase()] || 200}
                  value={quizConfig.limit}
                  onChange={(e) => {
                    let val = parseInt(e.target.value);
                    setQuizConfig({
                      ...quizConfig,
                      limit: isNaN(val) ? '' : val,
                    })
                  }}
                  className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-orange-500/10 focus:border-orange-500 transition-all outline-none text-slate-900 font-medium"
                  placeholder="Enter number..."
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm pointer-events-none">
                  Questions
                </span>
              </div>
              <p className="text-[11px] text-orange-600 mt-2 font-medium bg-orange-50 px-3 py-1.5 rounded-lg inline-block border border-orange-100/50 italic">
                {availableStats[quizConfig.questionType.toLowerCase()] !== null ? 
                  `Note: ${availableStats[quizConfig.questionType.toLowerCase()]} questions exist in the bank for this difficulty.` : 
                  'Verifying database limits...'}
              </p>
            </div>

            {/* Difficulty Level Section */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <HiAdjustments className="text-orange-500" />
                  <label className="block text-sm font-semibold text-slate-700">
                    Difficulty / Intensity
                  </label>
                </div>
                {chapterId && (
                  <button
                    onClick={handleResetProgress}
                    disabled={statsLoading}
                    className="text-[10px] uppercase tracking-wider font-bold text-orange-500 hover:text-orange-600 transition-colors flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-orange-50 border border-orange-100/50 hover:bg-orange-100"
                  >
                    <HiRefresh className={statsLoading ? "animate-spin" : ""} />
                    Reset Learning Progress
                  </button>
                )}
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 lg:gap-4">
                {[
                  { id: "Easy", icon: FiZap, color: "text-amber-500", bg: "bg-amber-500" },
                  { id: "Moderate", icon: FiActivity, color: "text-blue-500", bg: "bg-blue-500" },
                  { id: "Difficult", icon: FiTarget, color: "text-rose-500", bg: "bg-rose-500" },
                  { id: "Mixed", icon: FiLayers, color: "text-indigo-500", bg: "bg-indigo-500" },
                ].map((level) => {
                  const Icon = level.icon;
                  const statVal = availableStats[level.id.toLowerCase()];
                  const isDisabled = statVal === 0;
                  const isActive = quizConfig.questionType === level.id;

                  return (
                    <button
                      key={level.id}
                      disabled={isDisabled}
                      onClick={() => {
                        setQuizConfig({ ...quizConfig, questionType: level.id });
                      }}
                      className={`relative group p-4 rounded-xl border-2 transition-all duration-300 text-left overflow-hidden ${isActive
                          ? `border-orange-500 bg-white shadow-lg shadow-orange-100 ring-2 ring-orange-500/5`
                          : isDisabled
                            ? "bg-slate-50 border-slate-100 opacity-60 cursor-not-allowed"
                            : "bg-white border-slate-100 hover:border-slate-200 hover:shadow-md"
                        }`}
                    >
                      <div className={`p-2 rounded-lg w-fit mb-3 transition-colors ${isActive ? 'bg-orange-500 text-white' : `bg-slate-50 ${level.color}`}`}>
                        <Icon size={20} />
                      </div>

                      <div className="space-y-1">
                        <h4 className={`font-bold text-sm leading-tight ${isActive ? 'text-slate-900' : 'text-slate-700'}`}>
                          {level.id}
                        </h4>

                        {statsLoading ? (
                          <div className="h-3 w-16 bg-slate-100 rounded animate-pulse" />
                        ) : (
                          <div className="space-y-0.5">
                            <p className={`text-[10px] font-bold uppercase tracking-wider ${isActive ? 'text-orange-600' : 'text-slate-400'}`}>
                              {statVal} In Bank
                            </p>
                            {unattemptedStats[level.id.toLowerCase()] !== null && (
                              <p className={`text-[9px] font-medium leading-none ${isActive ? 'text-orange-400/80' : 'text-slate-300'}`}>
                                 {unattemptedStats[level.id.toLowerCase()]} New Left
                              </p>
                            )}
                          </div>
                        )}
                      </div>

                      {/* Active Indicator Pin */}
                      {isActive && (
                        <div className="absolute top-2 right-2 w-2 h-2 bg-orange-500 rounded-full shadow-[0_0_8px_rgba(249,115,22,0.8)]" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Premium Info Tiles Grid */}
            <div className="grid grid-cols-2 gap-4">
              {[
                { 
                  label: "Questions", 
                  value: `${quizConfig.limit} in Quiz / ${availableStats[quizConfig.questionType.toLowerCase()] || 0} in Bank`, 
                  icon: HiHashtag 
                },
                { label: "Mode", value: quizConfig.questionType, icon: HiLightBulb },
                { label: "Reports", value: "Detailed Review", icon: HiBadgeCheck },
                { label: "Sync", value: "Progress Tracked", icon: HiChartBar }
              ].map((tile, i) => (
                <div key={i} className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100/50">
                  <tile.icon className="text-orange-500/70" size={20} />
                  <div>
                    <p className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">{tile.label}</p>
                    <p className="text-xs font-semibold text-slate-700">{tile.value}</p>
                  </div>
                </div>
              ))}
            </div>

            <hr className="border-slate-100" />

            {/* Action Buttons */}
            <div className="space-y-4">
              {isAllAttempted && !loading && !statsLoading && (
                <div className="bg-orange-50 border border-orange-100 rounded-xl p-4 text-center animate-in fade-in slide-in-from-top-1 duration-300">
                  <p className="text-sm font-semibold text-orange-700">All questions attempted!</p>
                  <p className="text-[11px] text-orange-600 mt-1 uppercase tracking-wider font-bold">Please use the "Reset Learning Progress" button above to start again.</p>
                </div>
              )}
              <button
                onClick={handleStartQuiz}
                disabled={loading || statsLoading || isAllAttempted}
                className="w-full relative group overflow-hidden bg-orange-500 text-white py-4 rounded-xl font-bold shadow-lg shadow-orange-200 hover:shadow-orange-300 transition-all active:scale-[0.98] disabled:bg-slate-200 disabled:shadow-none disabled:text-slate-400 disabled:cursor-not-allowed"
              >
                <span className="relative z-10 flex items-center justify-center gap-2">
                  {loading || statsLoading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>{loading ? "Preparing Session..." : "Validating Bank..."}</span>
                    </>
                  ) : isAllAttempted ? (
                    <>
                      <HiRefresh size={20} />
                      <span>Reset Required to Start</span>
                    </>
                  ) : (
                    <>
                      <HiClipboardCheck size={20} />
                      <span>Start Knowledge Check</span>
                    </>
                  )}
                </span>
                {/* Shiny Button Effect */}
                {!loading && !statsLoading && !isAllAttempted && (
                  <div className="absolute top-0 -left-full w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent group-hover:left-full transition-all duration-1000 ease-in-out" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Quiz Attempts Warning for Free Users */}
        {activeUser && !isActiveSubscriber(activeUser) && (
          <div className="mt-8 transform transition-all animate-in fade-in slide-in-from-bottom-2 duration-700">
            <QuizAttemptsCounter
              used={getUsedQuizAttempts(activeUser)}
              total={50}
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
