import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import API from '../../api/api';

// Async thunks for podcast operations
export const fetchPodcastSubjects = createAsyncThunk(
  'podcasts/fetchSubjects',
  async (courseId, { rejectWithValue }) => {
    try {
      const response = await API.get('/podcasts/subjects', {
        params: {
          course_id: courseId,
          media_type: null
        }
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to fetch podcast subjects');
    }
  }
);

export const fetchPodcastsBySubject = createAsyncThunk(
  'podcasts/fetchBySubject',
  async ({ courseId, subjectId }, { rejectWithValue }) => {
    try {
      const response = await API.get('/podcasts', {
        params: {
          course_id: courseId,
          subject_id: subjectId,
          media_type: null
        }
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to fetch podcasts');
    }
  }
);

// Initial state
const initialState = {
  subjects: [],
  currentSubjectPodcasts: [],
  selectedSubject: null,
  loading: false,
  podcastsLoading: false,
  error: null,
};

// Podcasts slice
const podcastsSlice = createSlice({
  name: 'podcasts',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setSelectedSubject: (state, action) => {
      state.selectedSubject = action.payload;
    },
    clearPodcasts: (state) => {
      state.currentSubjectPodcasts = [];
      state.selectedSubject = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch podcast subjects
      .addCase(fetchPodcastSubjects.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPodcastSubjects.fulfilled, (state, action) => {
        state.loading = false;
        // Filter subjects to only show those with podcasts
        state.subjects = action.payload.data?.filter(subject => subject.podcasts_count > 0) || [];
      })
      .addCase(fetchPodcastSubjects.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Fetch podcasts by subject
      .addCase(fetchPodcastsBySubject.pending, (state) => {
        state.podcastsLoading = true;
        state.error = null;
      })
      .addCase(fetchPodcastsBySubject.fulfilled, (state, action) => {
        state.podcastsLoading = false;
        state.currentSubjectPodcasts = action.payload.data || [];
      })
      .addCase(fetchPodcastsBySubject.rejected, (state, action) => {
        state.podcastsLoading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError, setSelectedSubject, clearPodcasts } = podcastsSlice.actions;

// Selectors
export const selectPodcastSubjects = (state) => state.podcasts.subjects;
export const selectCurrentSubjectPodcasts = (state) => state.podcasts.currentSubjectPodcasts;
export const selectSelectedSubject = (state) => state.podcasts.selectedSubject;
export const selectPodcastsLoading = (state) => state.podcasts.loading;
export const selectPodcastsLoadingBySubject = (state) => state.podcasts.podcastsLoading;
export const selectPodcastsError = (state) => state.podcasts.error;

export default podcastsSlice.reducer;
