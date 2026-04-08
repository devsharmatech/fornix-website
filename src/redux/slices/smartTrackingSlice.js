import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import API from '../../api/api';

// Async thunk to compute smart tracking data
export const computeSmartTracking = createAsyncThunk(
  'smartTracking/compute',
  async ({ userId, courseId, forceRefresh = false, useAi = false }, { rejectWithValue }) => {
    try {
      const response = await API.post('/smart-tracking/compute-v2', {
        user_id: userId,
        course_id: courseId,
        force_refresh: forceRefresh,
        use_ai: useAi
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to compute tracking data');
    }
  }
);

// Mark notes as completed for a chapter
export const markNotesCompleted = createAsyncThunk(
  'smartTracking/markNotesCompleted',
  async ({ userId, chapterId }, { rejectWithValue }) => {
    try {
      const response = await API.post('/smart-tracking/study-progress', {
        user_id: userId,
        chapter_id: chapterId,
      });
      return { chapterId, ...response.data };
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to mark notes completed');
    }
  }
);

// Check study progress for a chapter (or all chapters)
export const fetchStudyProgress = createAsyncThunk(
  'smartTracking/fetchStudyProgress',
  async ({ userId, chapterId = null }, { rejectWithValue }) => {
    try {
      const params = new URLSearchParams({ user_id: userId });
      if (chapterId) params.append('chapter_id', chapterId);
      const response = await API.get(`/smart-tracking/study-progress?${params.toString()}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to fetch study progress');
    }
  }
);

const initialState = {
  data: null,
  loading: false,
  error: null,
  // Study progress state
  studyProgress: {},       // { [chapterId]: { notes_completed, mcq_completed, can_attempt_mcq } }
  studyProgressLoading: false,
};

const smartTrackingSlice = createSlice({
  name: 'smartTracking',
  initialState,
  reducers: {
    clearSmartTrackingData: (state) => {
      state.data = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Compute smart tracking
      .addCase(computeSmartTracking.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(computeSmartTracking.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload) {
          state.data = action.payload;
        }
      })
      .addCase(computeSmartTracking.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Mark notes completed
      .addCase(markNotesCompleted.pending, (state) => {
        state.studyProgressLoading = true;
      })
      .addCase(markNotesCompleted.fulfilled, (state, action) => {
        state.studyProgressLoading = false;
        const { chapterId } = action.payload;
        state.studyProgress[chapterId] = {
          ...state.studyProgress[chapterId],
          notes_completed: true,
          can_attempt_mcq: true,
        };
      })
      .addCase(markNotesCompleted.rejected, (state) => {
        state.studyProgressLoading = false;
      })
      // Fetch study progress
      .addCase(fetchStudyProgress.fulfilled, (state, action) => {
        if (action.payload?.data && Array.isArray(action.payload.data)) {
          for (const entry of action.payload.data) {
            state.studyProgress[entry.chapter_id] = {
              notes_completed: entry.notes_completed,
              mcq_completed: entry.mcq_completed,
              can_attempt_mcq: entry.notes_completed,
            };
          }
        } else if (action.payload?.notes_completed !== undefined) {
          // Single chapter response
          const chapterId = action.meta?.arg?.chapterId;
          if (chapterId) {
            state.studyProgress[chapterId] = {
              notes_completed: action.payload.notes_completed,
              mcq_completed: action.payload.mcq_completed,
              can_attempt_mcq: action.payload.can_attempt_mcq,
            };
          }
        }
      });
  },
});

export const { clearSmartTrackingData } = smartTrackingSlice.actions;

export const selectSmartTrackingData = (state) => state.smartTracking.data;
export const selectSmartTrackingLoading = (state) => state.smartTracking.loading;
export const selectSmartTrackingError = (state) => state.smartTracking.error;
export const selectStudyProgress = (state) => state.smartTracking.studyProgress;
export const selectStudyProgressLoading = (state) => state.smartTracking.studyProgressLoading;

export default smartTrackingSlice.reducer;

