import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import API from '../../api/api';

// Async thunks for dashboard
export const fetchStudyMaterials = createAsyncThunk(
  'dashboard/fetchStudyMaterials',
  async (userId, { rejectWithValue }) => {
    try {
      const response = await API.get(`/dashboard/study-materials/${userId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to fetch study materials');
    }
  }
);

export const fetchMCQBank = createAsyncThunk(
  'dashboard/fetchMCQBank',
  async (userId, { rejectWithValue }) => {
    try {
      const response = await API.get(`/dashboard/mcq-bank/${userId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to fetch MCQ bank');
    }
  }
);

export const fetchUserProgress = createAsyncThunk(
  'dashboard/fetchProgress',
  async (userId, { rejectWithValue }) => {
    try {
      const response = await API.get(`/dashboard/progress/${userId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to fetch progress');
    }
  }
);

export const submitMCQAnswer = createAsyncThunk(
  'dashboard/submitMCQAnswer',
  async ({ questionId, answer }, { rejectWithValue }) => {
    try {
      const response = await API.post('/dashboard/mcq/submit', { questionId, answer });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to submit answer');
    }
  }
);

// Initial state
const initialState = {
  studyMaterials: [],
  mcqBank: [],
  progress: {},
  activePlan: null,
  loading: false,
  error: null,
};

// Dashboard slice
const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setActivePlan: (state, action) => {
      state.activePlan = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch study materials
      .addCase(fetchStudyMaterials.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchStudyMaterials.fulfilled, (state, action) => {
        state.loading = false;
        state.studyMaterials = action.payload;
      })
      .addCase(fetchStudyMaterials.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Fetch MCQ bank
      .addCase(fetchMCQBank.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMCQBank.fulfilled, (state, action) => {
        state.loading = false;
        state.mcqBank = action.payload;
      })
      .addCase(fetchMCQBank.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Fetch user progress
      .addCase(fetchUserProgress.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserProgress.fulfilled, (state, action) => {
        state.loading = false;
        state.progress = action.payload;
      })
      .addCase(fetchUserProgress.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Submit MCQ answer
      .addCase(submitMCQAnswer.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(submitMCQAnswer.fulfilled, (state, action) => {
        state.loading = false;
        // Update progress or MCQ state as needed
      })
      .addCase(submitMCQAnswer.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError, setActivePlan } = dashboardSlice.actions;

// Selectors
export const selectStudyMaterials = (state) => state.dashboard.studyMaterials;
export const selectMCQBank = (state) => state.dashboard.mcqBank;
export const selectProgress = (state) => state.dashboard.progress;
export const selectActivePlan = (state) => state.dashboard.activePlan;
export const selectDashboardLoading = (state) => state.dashboard.loading;
export const selectDashboardError = (state) => state.dashboard.error;

export default dashboardSlice.reducer;
