import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import API from '../../api/api';

// Async thunks for subjects
export const fetchSubjectsByCourse = createAsyncThunk(
  'subjects/fetchByCourse',
  async (courseId, { rejectWithValue }) => {
    try {
      const response = await API.post('/subjects', { course_id: courseId });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to fetch subjects');
    }
  }
);

// Initial state
const initialState = {
  subjects: [],
  selectedSubject: null,
  loading: false,
  error: null,
};

// Subjects slice
const subjectsSlice = createSlice({
  name: 'subjects',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setSelectedSubject: (state, action) => {
      state.selectedSubject = action.payload;
    },
    clearSubjects: (state) => {
      state.subjects = [];
      state.selectedSubject = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSubjectsByCourse.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSubjectsByCourse.fulfilled, (state, action) => {
        state.loading = false;
        // Handle different response formats
        // Check if response has {success: true, data: [...]} format (most common)
        if (action.payload && Array.isArray(action.payload.data)) {
          state.subjects = action.payload.data;
        } else if (Array.isArray(action.payload)) {
          state.subjects = action.payload;
        } else if (action.payload && Array.isArray(action.payload.subjects)) {
          state.subjects = action.payload.subjects;
        } else {
          console.warn('Unexpected subjects API format:', action.payload);
          state.subjects = [];
        }
      })
      .addCase(fetchSubjectsByCourse.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError, setSelectedSubject, clearSubjects } = subjectsSlice.actions;

// Selectors
export const selectSubjects = (state) => state.subjects.subjects;
export const selectSelectedSubject = (state) => state.subjects.selectedSubject;
export const selectSubjectsLoading = (state) => state.subjects.loading;
export const selectSubjectsError = (state) => state.subjects.error;

export default subjectsSlice.reducer;
