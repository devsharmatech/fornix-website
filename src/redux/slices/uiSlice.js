import { createSlice } from '@reduxjs/toolkit';

// Initial state
const initialState = {
  notifications: [],
  modals: {
    login: false,
    payment: false,
    courseDetails: false,
  },
  globalLoading: false,
};

// UI slice
const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    showNotification: (state, action) => {
      state.notifications.push({
        id: Date.now(),
        type: action.payload.type, // 'success', 'error', 'info', 'warning'
        message: action.payload.message,
        duration: action.payload.duration || 3000,
      });
    },
    hideNotification: (state, action) => {
      state.notifications = state.notifications.filter(
        (notification) => notification.id !== action.payload
      );
    },
    clearAllNotifications: (state) => {
      state.notifications = [];
    },
    openModal: (state, action) => {
      state.modals[action.payload] = true;
    },
    closeModal: (state, action) => {
      state.modals[action.payload] = false;
    },
    closeAllModals: (state) => {
      Object.keys(state.modals).forEach((key) => {
        state.modals[key] = false;
      });
    },
    setGlobalLoading: (state, action) => {
      state.globalLoading = action.payload;
    },
  },
});

export const {
  showNotification,
  hideNotification,
  clearAllNotifications,
  openModal,
  closeModal,
  closeAllModals,
  setGlobalLoading,
} = uiSlice.actions;

// Selectors
export const selectNotifications = (state) => state.ui.notifications;
export const selectModals = (state) => state.ui.modals;
export const selectGlobalLoading = (state) => state.ui.globalLoading;

export default uiSlice.reducer;
