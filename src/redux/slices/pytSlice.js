import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import API from '../../api/api';

// Async thunk to fetch PYT subjects by course
export const fetchPYTSubjects = createAsyncThunk(
  'pyt/fetchSubjects',
  async (courseId, { rejectWithValue }) => {
    try {
      const response = await API.post('/pyt/subjects', { course_id: courseId });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to fetch PYT subjects');
    }
  }
);

// Async thunk to fetch PYT topics by subject
export const fetchPYTTopics = createAsyncThunk(
  'pyt/fetchTopics',
  async ({ subjectId, year }, { rejectWithValue }) => {
    try {
      const requestBody = { subject_id: subjectId };
      if (year) {
        requestBody.year = year;
      }
      const response = await API.post('/pyt/topics', requestBody);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to fetch PYT topics');
    }
  }
);

// Initial state
const initialState = {
  subjects: [],
  topics: [],
  selectedSubject: null,
  loading: false,
  error: null,
};

// PYT slice
const pytSlice = createSlice({
  name: 'pyt',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearSubjects: (state) => {
      state.subjects = [];
    },
    clearTopics: (state) => {
      state.topics = [];
    },
    setSelectedSubject: (state, action) => {
      state.selectedSubject = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch PYT subjects
      .addCase(fetchPYTSubjects.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPYTSubjects.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload.success && Array.isArray(action.payload.subjects)) {
          state.subjects = action.payload.subjects;
        } else {
          state.subjects = [];
        }
      })
      .addCase(fetchPYTSubjects.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch PYT topics
      .addCase(fetchPYTTopics.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPYTTopics.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload.success && Array.isArray(action.payload.topics)) {
          state.topics = action.payload.topics;
        } else {
          state.topics = [];
        }
      })
      .addCase(fetchPYTTopics.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError, clearSubjects, clearTopics, setSelectedSubject } = pytSlice.actions;

// Selectors
export const selectPYTSubjects = (state) => state.pyt.subjects;
export const selectPYTTopics = (state) => state.pyt.topics;
export const selectPYTSelectedSubject = (state) => state.pyt.selectedSubject;
export const selectPYTLoading = (state) => state.pyt.loading;
export const selectPYTError = (state) => state.pyt.error;

export default pytSlice.reducer;
