// Access Control Utility Functions
// Manages user permissions for courses, quizzes, and content

const QUIZ_LIMIT_FREE_USER = 2;

/**
 * Get quiz attempts data from localStorage
 */
const getQuizAttemptsData = (userId) => {
  if (!userId) return { total: 0, attempts: [] };
  
  const key = `quiz_attempts_${userId}`;
  const data = localStorage.getItem(key);
  
  if (!data) {
    return { total: 0, attempts: [] };
  }
  
  try {
    return JSON.parse(data);
  } catch (e) {
    console.error('Error parsing quiz attempts data:', e);
    return { total: 0, attempts: [] };
  }
};

/**
 * Save quiz attempts data to localStorage
 */
const saveQuizAttemptsData = (userId, data) => {
  if (!userId) return;
  
  const key = `quiz_attempts_${userId}`;
  localStorage.setItem(key, JSON.stringify(data));
};

/**
 * Check if user has a valid subscription
 * Checks both the flag and the subscriptions array
 */
export const isActiveSubscriber = (user) => {
  if (!user) return false;
  
  if (user.has_active_subscription) return true;
  
  // Check student_type
  if (user.student_type === 'paid' || user.student_type === 'premium') return true;

  // Check role
  if (user.role === 'admin' || user.role === 'moderator') return true;
  
  // Also check subscriptions array as fallback
  if (user.subscriptions && Array.isArray(user.subscriptions) && user.subscriptions.length > 0) {
    const hasActive = user.subscriptions.some(sub => sub.is_active || sub.status === 'active');
    if (hasActive) return true;
    
    // If we have subscriptions but none explicitly marked active, 
    // we might still want to allow access if "subscriptions" exists and is not empty
    // assuming the backend only sends valid subscriptions.
    if (user.subscriptions.length > 0) return true;
  }
  
  return false;
};

/**
 * Check if user can attempt a quiz
 * Free users (no active subscription): limited to 2 total attempts
 * Paid users (with active subscription): unlimited attempts in their subscribed course
 */
export const canAttemptQuiz = (user, courseId = null) => {
  
  
  if (!user) {
    
    return false;
  }
  
  // Paid users with active subscription can attempt unlimited quizzes in their course
  if (isActiveSubscriber(user)) {
    
    // If courseId is provided, check if it's their subscribed course
    if (courseId) {
      const hasAccess = canAccessCourse(user, courseId);
      
      return hasAccess;
    }
    return true;
  }
  
  // Free users (no active subscription) are limited to 2 attempts total
  const userId = user.id || user.user_id;
  
  
  const attemptsData = getQuizAttemptsData(userId);
  
  
  const canAttempt = attemptsData.total < QUIZ_LIMIT_FREE_USER;
    

  return canAttempt;
};

/**
 * Get remaining quiz attempts for user
 * Returns number for free users, 'unlimited' for paid users
 */
export const getRemainingQuizAttempts = (user) => {
  if (!user) return 0;
  
  if (isActiveSubscriber(user)) {
    return 'unlimited';
  }
  
  // Free users (no active subscription)
  const attemptsData = getQuizAttemptsData(user.id || user.user_id);
  return Math.max(0, QUIZ_LIMIT_FREE_USER - attemptsData.total);
};

/**
 * Get number of quiz attempts already USED by the user
 * Returns 0 for a fresh free user, up to QUIZ_LIMIT_FREE_USER
 */
export const getUsedQuizAttempts = (user) => {
  if (!user) return 0;
  if (isActiveSubscriber(user)) return 0;
  
  const attemptsData = getQuizAttemptsData(user.id || user.user_id);
  return Math.min(attemptsData.total, QUIZ_LIMIT_FREE_USER);
};

/**
 * Track a quiz attempt for the user
 */
export const trackQuizAttempt = (user, quizId, chapterId = null) => {
  // Only track for free users (no active subscription)
  if (!user || isActiveSubscriber(user)) return;
  
  const userId = user.id || user.user_id;
  const attemptsData = getQuizAttemptsData(userId);
  
  // Add new attempt
  attemptsData.attempts.push({
    quizId,
    chapterId,
    timestamp: new Date().toISOString()
  });
  
  attemptsData.total = attemptsData.attempts.length;
  
  saveQuizAttemptsData(userId, attemptsData);
  
  return attemptsData;
};

/**
 * Check if user has exceeded quiz limit
 */
export const hasExceededQuizLimit = (user) => {
  if (!user) return true;
  
  if (isActiveSubscriber(user)) {
    return false;
  }
  
  // Free users (no active subscription)
  const attemptsData = getQuizAttemptsData(user.id || user.user_id);
  return attemptsData.total >= QUIZ_LIMIT_FREE_USER;
};

/**
 * Check if user can access a specific course
 * Free users: can access their enrolled course only
 * Paid users: can access their subscribed/purchased course only
 */
export const canAccessCourse = (user, courseId) => {
  if (!user || !courseId) return false;
  
  // 1. Direct Course Enrollment Check
  // If the user's primary course_id matches, they have access.
  // This covers both Free and Paid users who are enrolled in this course.
  if (user.course_id === courseId) {
    return true;
  }
  
  // Legacy/Slug Check: Handle case where user has "course": "amc" instead of UUID
  const AMC_ID = 'cc613b33-3986-4d67-b33a-009b57a72dc8';
  const FMGE_ID = 'f6dd0d25-825f-4c9c-93fe-58cae47378f3';

  if ((user.course === 'amc' || user.course === 'AMC') && courseId === AMC_ID) {
    return true;
  }
  
  if ((user.course === 'fmge' || user.course === 'FMGE') && courseId === FMGE_ID) {
    return true;
  }
  
  // 2. Subscriptions Check
  // If user has active subscriptions, check if this course is in there.
  if (user.has_active_subscription) {
    if (user.subscriptions && Array.isArray(user.subscriptions)) {
      return user.subscriptions.some(sub => 
        (sub.course && sub.course.id === courseId) || 
        sub.course_id === courseId
      );
    }
  }
  
  return false;
};

/**
 * Get note type based on user subscription and course access
 * Returns 'full' for paid users with course access, 'sample' otherwise
 */
export const getNoteType = (user, courseId) => {
  
  
  // No user or no courseId = sample notes
  if (!user || !courseId) {
    
    return 'sample';
  }
  
  // Check if user has access to this course
  const hasAccess = canAccessCourse(user, courseId);
  
  
  // If user has access and active subscription, give full notes
  if (hasAccess && user.has_active_subscription) {
    
    return 'full';
  }
  
  // Otherwise, sample notes
  
  return 'sample';
};

/**
 * Get list of courses user can access
 */
export const getUserAccessibleCourses = (user) => {
  if (!user) return [];
  
  const accessibleCourseIds = [];
  
  if (user.subscriptions && Array.isArray(user.subscriptions)) {
    user.subscriptions.forEach(sub => {
      if (sub.course?.id) {
        accessibleCourseIds.push(sub.course.id);
      }
    });
  }
  
  if (user.course_id && !accessibleCourseIds.includes(user.course_id)) {
    accessibleCourseIds.push(user.course_id);
  }
  
  return accessibleCourseIds;
};

/**
 * Check if a course is locked for the user
 */
export const isCourseLocked = (user, courseId) => {
  return !canAccessCourse(user, courseId);
};



/**
 * Check if user can view full notes for a course
 */
export const canViewFullNotes = (user, courseId) => {
  if (!user) return false;
  
  return user.has_active_subscription && canAccessCourse(user, courseId);
};

/**
 * Determine if upgrade prompt should be shown
 */
export const shouldShowUpgradePrompt = (user, feature) => {
  if (!user) return true;
  
  switch (feature) {
    case 'quiz':
      return !user.has_active_subscription && hasExceededQuizLimit(user);
    
    case 'full_notes':
      return !user.has_active_subscription;
    
    case 'course_access':
      return !user.has_active_subscription;
    
    default:
      return false;
  }
};

/**
 * Get appropriate upgrade message based on user and feature
 */
export const getUpgradeMessage = (user, feature) => {
  if (!user) return 'Please login to continue';
  
  const messages = {
    quiz: {
      title: 'Free Quiz Limit Reached',
      description: `You've used all ${QUIZ_LIMIT_FREE_USER} free quiz attempts. Upgrade to get unlimited quizzes and full access to all content.`,
      cta: 'Upgrade to Premium'
    },
    full_notes: {
      title: 'Unlock Full Notes',
      description: 'You\'re currently viewing sample notes. Upgrade to access complete study materials and resources.',
      cta: 'View Plans'
    },
    course_access: {
      title: 'Course Locked',
      description: 'This course is not included in your current plan. Purchase a subscription to unlock full access.',
      cta: 'View Pricing'
    },
    default: {
      title: 'Upgrade Required',
      description: 'Unlock all features with a premium subscription.',
      cta: 'Upgrade Now'
    }
  };
  
  return messages[feature] || messages.default;
};

/**
 * Reset quiz attempts (for testing or admin purposes)
 */
export const resetQuizAttempts = (userId) => {
  if (!userId) return;
  
  const key = `quiz_attempts_${userId}`;
  localStorage.removeItem(key);
};

/**
 * Get quiz attempts history
 */
export const getQuizAttemptsHistory = (user) => {
  if (!user) return [];
  
  const attemptsData = getQuizAttemptsData(user.id || user.user_id);
  return attemptsData.attempts || [];
};
