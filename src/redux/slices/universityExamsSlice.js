import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import API from '../../api/api';

// Async thunks for University Exams

// 1. Fetch List of University Exams
export const fetchUniversityExamsList = createAsyncThunk(
  'universityExams/fetchList',
  async (_, { rejectWithValue, getState }) => {
    try {
      const state = getState();
      const user_id = state.auth.user?.user_id || state.auth.user?.id || state.auth.user?.uuid;

      if (!user_id) {
        return rejectWithValue('User not loaded yet');
      }

      const response = await API.post('/university-exams/list', { user_id });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to fetch university exams');
    }
  }
);

// 2. Fetch History of Attempted Exams
export const fetchUniversityExamsHistory = createAsyncThunk(
  'universityExams/fetchHistory',
  async (_, { rejectWithValue, getState }) => {
    try {
      const state = getState();
      const user_id = state.auth.user?.user_id || state.auth.user?.id || state.auth.user?.uuid;

      if (!user_id) {
        return rejectWithValue('User not loaded yet');
      }

      const response = await API.post('/university-exams/history', { user_id });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to fetch university exam history');
    }
  }
);

// 3. Fetch Specific Exam Details (Questions)
export const fetchUniversityExamDetails = createAsyncThunk(
  'universityExams/fetchDetails',
  async (exam_id, { rejectWithValue, getState }) => {
    try {
      const state = getState();
      const user_id = state.auth.user?.user_id || state.auth.user?.id || state.auth.user?.uuid;

      if (!user_id) {
        return rejectWithValue('User not loaded yet');
      }

      const response = await API.post('/university-exams/details', { user_id, exam_id });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || error.response?.data?.message || 'Failed to fetch exam details');
    }
  }
);

// 4. Submit Exam Attempt
export const attemptUniversityExam = createAsyncThunk(
  'universityExams/attempt',
  async ({ exam_id, answers }, { rejectWithValue, getState }) => {
    try {
      const state = getState();
      const user_id = state.auth.user?.user_id || state.auth.user?.id || state.auth.user?.uuid;

      if (!user_id) {
        return rejectWithValue('User not loaded yet');
      }

      const response = await API.post('/university-exams/attempt', { 
        user_id, 
        exam_id, 
        answers 
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || error.response?.data?.message || 'Failed to submit exam');
    }
  }
);

// 5. Fetch Exam Result
export const fetchUniversityExamResult = createAsyncThunk(
  'universityExams/fetchResult',
  async (exam_id, { rejectWithValue, getState }) => {
    try {
      const state = getState();
      const user_id = state.auth.user?.user_id || state.auth.user?.id || state.auth.user?.uuid;

      if (!user_id) {
        return rejectWithValue('User not loaded yet');
      }

      const response = await API.post('/university-exams/result', { user_id, exam_id });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to fetch exam result');
    }
  }
);

// Initial State
const initialState = {
  examsList: [],
  examsHistory: [],
  currentExamDetails: null, // Holds questions and exam info
  examResult: null,         // Holds score, correct/incorrect count, and review
  
  // Loading states
  loading: false,
  historyLoading: false,
  detailsLoading: false,
  attemptLoading: false,
  resultLoading: false,
  
  error: null,
};

// University Exams Slice
const universityExamsSlice = createSlice({
  name: 'universityExams',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearCurrentExam: (state) => {
      state.currentExamDetails = null;
    },
    clearExamResult: (state) => {
      state.examResult = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // 1. Fetch List
      .addCase(fetchUniversityExamsList.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUniversityExamsList.fulfilled, (state, action) => {
        state.loading = false;
        state.examsList = action.payload.data || [];
      })
      .addCase(fetchUniversityExamsList.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // 2. Fetch History
      .addCase(fetchUniversityExamsHistory.pending, (state) => {
        state.historyLoading = true;
        state.error = null;
      })
      .addCase(fetchUniversityExamsHistory.fulfilled, (state, action) => {
        state.historyLoading = false;
        state.examsHistory = action.payload.data || [];
      })
      .addCase(fetchUniversityExamsHistory.rejected, (state, action) => {
        state.historyLoading = false;
        state.error = action.payload;
      })

      // 3. Fetch Details
      .addCase(fetchUniversityExamDetails.pending, (state) => {
        state.detailsLoading = true;
        state.error = null;
        state.currentExamDetails = null;
      })
      .addCase(fetchUniversityExamDetails.fulfilled, (state, action) => {
        state.detailsLoading = false;
        state.currentExamDetails = action.payload;
      })
      .addCase(fetchUniversityExamDetails.rejected, (state, action) => {
        state.detailsLoading = false;
        state.error = action.payload;
      })

      // 4. Attempt Exam
      .addCase(attemptUniversityExam.pending, (state) => {
        state.attemptLoading = true;
        state.error = null;
      })
      .addCase(attemptUniversityExam.fulfilled, (state, action) => {
        state.attemptLoading = false;
        // Exam submitted successfully, you can automatically set result if API returns it
        if (action.payload.attempt_id) {
           state.examResult = action.payload;
        }
      })
      .addCase(attemptUniversityExam.rejected, (state, action) => {
        state.attemptLoading = false;
        // Handle "You have already attempted this exam." properly without breaking flow if needed
        state.error = action.payload;
      })

      // 5. Fetch Result
      .addCase(fetchUniversityExamResult.pending, (state) => {
        state.resultLoading = true;
        state.error = null;
      })
      .addCase(fetchUniversityExamResult.fulfilled, (state, action) => {
        state.resultLoading = false;
        state.examResult = action.payload;
      })
      .addCase(fetchUniversityExamResult.rejected, (state, action) => {
        state.resultLoading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError, clearCurrentExam, clearExamResult } = universityExamsSlice.actions;

// Selectors
export const selectUniversityExamsList = (state) => state.universityExams.examsList;
export const selectUniversityExamsHistory = (state) => state.universityExams.examsHistory;
export const selectCurrentUniversityExam = (state) => state.universityExams.currentExamDetails;
export const selectUniversityExamResult = (state) => state.universityExams.examResult;
export const selectUniversityExamsLoading = (state) => state.universityExams.loading;
export const selectUniversityExamsError = (state) => state.universityExams.error;
export const selectUniversityExamsDetailsLoading = (state) => state.universityExams.detailsLoading;
export const selectUniversityExamsAttemptLoading = (state) => state.universityExams.attemptLoading;
export const selectUniversityExamsResultLoading = (state) => state.universityExams.resultLoading;

export default universityExamsSlice.reducer;
