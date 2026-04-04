import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import API from '../../api/api';

// Async thunk to compute smart tracking data
export const computeSmartTracking = createAsyncThunk(
  'smartTracking/compute',
  async ({ userId, courseId, forceRefresh = false, useAi = false }, { rejectWithValue }) => {
    try {
      // Use API instead of axios
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

const initialState = {
  data: null,
  loading: false,
  error: null,
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
      .addCase(computeSmartTracking.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(computeSmartTracking.fulfilled, (state, action) => {
        state.loading = false;
        // Update to handle v2 correctly retaining whatever fields came back from cache
        if (action.payload) {
          state.data = action.payload;
        }
      })
      .addCase(computeSmartTracking.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearSmartTrackingData } = smartTrackingSlice.actions;

export const selectSmartTrackingData = (state) => state.smartTracking.data;
export const selectSmartTrackingLoading = (state) => state.smartTracking.loading;
export const selectSmartTrackingError = (state) => state.smartTracking.error;

export default smartTrackingSlice.reducer;
