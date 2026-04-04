import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import coursesReducer from './slices/coursesSlice';
import dashboardReducer from './slices/dashboardSlice';
import paymentReducer from './slices/paymentSlice';
import uiReducer from './slices/uiSlice';
import homeReducer from './slices/homeSlice';
import userReducer from './slices/userSlice';
import subjectsReducer from './slices/subjectsSlice';
import chaptersReducer from './slices/chaptersSlice';
import quizReducer from './slices/quizSlice';
import notesReducer from './slices/notesSlice';
import mockTestsReducer from './slices/mockTestsSlice';
import pytReducer from './slices/pytSlice';
import podcastsReducer from './slices/podcastsSlice';
import discussionsReducer from './slices/discussionsSlice';
import rankingsReducer from './slices/rankingsSlice';
import smartTrackingReducer from './slices/smartTrackingSlice';
import chatReducer from './slices/chatSlice';
import universityExamsReducer from './slices/universityExamsSlice';
import notificationReducer from './slices/notificationSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    courses: coursesReducer,
    dashboard: dashboardReducer,
    payment: paymentReducer,
    ui: uiReducer,
    home: homeReducer,
    user: userReducer,
    subjects: subjectsReducer,
    chapters: chaptersReducer,
    quiz: quizReducer,
    notes: notesReducer,
    mockTests: mockTestsReducer,
    pyt: pytReducer,
    podcasts: podcastsReducer,
    discussions: discussionsReducer,
    rankings: rankingsReducer,
    smartTracking: smartTrackingReducer,
    chat: chatReducer,
    universityExams: universityExamsReducer,
    notifications: notificationReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these action types
        ignoredActions: ['payment/initiate/fulfilled'],
      },
    }),
  devTools: process.env.NODE_ENV !== 'production',
});

// Export types for TypeScript-like usage
export const getState = store.getState;
export const dispatch = store.dispatch;
