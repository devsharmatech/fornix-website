import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import API from '../../api/api';

// Async thunks for chapters
export const fetchChaptersBySubject = createAsyncThunk(
  'chapters/fetchBySubject',
  async (subjectId, { getState, rejectWithValue }) => {
    try {
      const state = getState();
      const userId = state.auth?.user?.id || state.auth?.user?._id || state.auth?.user?.uuid || state.auth?.user?.user_id;

      const payload = { subject_id: subjectId };
      if (userId) payload.user_id = userId;

      const response = await API.post('/chapters', payload);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to fetch chapters');
    }
  }
);

export const fetchTopicsByChapter = createAsyncThunk(
  'chapters/fetchTopics',
  async (chapterId, { getState, rejectWithValue }) => {
    try {
      const state = getState();
      const userId = state.auth?.user?.id || state.auth?.user?._id || state.auth?.user?.uuid || state.auth?.user?.user_id;

      const payload = { chapter_id: chapterId };
      if (userId) payload.user_id = userId;

      const response = await API.post('/chapters/topics', payload);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to fetch topics');
    }
  }
);

// Fetch notes for a specific chapter
export const fetchChapterNotes = createAsyncThunk(
  'chapters/fetchNotes',
  async ({ courseId, chapterId, noteType = 'sample' }, { rejectWithValue }) => {
    try {
      const response = await API.post('/notes', { 
        course_id: courseId, 
        chapter_id: chapterId,
        note_type: noteType // 'sample' or 'full'
      });
      return { chapterId, data: response.data };
    } catch (error) {
      return rejectWithValue({ 
        chapterId, 
        error: error.response?.data?.error || 'Failed to fetch notes' 
      });
    }
  }
);

// Initial state
const initialState = {
  chapters: [],
  // topics: [], // Deprecated in favor of keyed storage, but kept for legacy if needed, or removed. Let's remove to force strict usage.
  selectedChapter: null,
  chapterNotes: {}, // { [chapterId]: { notes: [], loading: false, error: null } }
  chapterTopics: {}, // { [chapterId]: { topics: [], loading: false, error: null } }
  loading: false,
  error: null,
};

// Chapters slice
const chaptersSlice = createSlice({
  name: 'chapters',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setSelectedChapter: (state, action) => {
      state.selectedChapter = action.payload;
    },
    clearChapters: (state) => {
      state.chapters = [];
      state.chapterTopics = {};
      state.selectedChapter = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch chapters
      .addCase(fetchChaptersBySubject.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchChaptersBySubject.fulfilled, (state, action) => {
        state.loading = false;
        // Handle {success: true, data: [...]} format
        if (action.payload && Array.isArray(action.payload.data)) {
          state.chapters = action.payload.data;
        } else if (Array.isArray(action.payload)) {
          state.chapters = action.payload;
        } else {
          state.chapters = [];
        }
      })
      .addCase(fetchChaptersBySubject.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Fetch topics
      .addCase(fetchTopicsByChapter.pending, (state, action) => {
        const { arg: chapterId } = action.meta; // Correctly access argument from thunk
        if (!state.chapterTopics[chapterId]) {
             state.chapterTopics[chapterId] = { topics: [], loading: true, error: null };
        } else {
             state.chapterTopics[chapterId].loading = true;
        }
        // state.loading = true; // Global loading? Maybe specific is better.
      })
      .addCase(fetchTopicsByChapter.fulfilled, (state, action) => {
        const { arg: chapterId } = action.meta;
        // state.loading = false;
        
        let topicsData = [];
        if (action.payload && Array.isArray(action.payload.data)) {
            topicsData = action.payload.data;
        } else if (Array.isArray(action.payload)) {
            topicsData = action.payload;
        }
        
        state.chapterTopics[chapterId] = {
            topics: topicsData,
            loading: false,
            error: null
        };
      })
      .addCase(fetchTopicsByChapter.rejected, (state, action) => {
        const { arg: chapterId } = action.meta;
        // state.loading = false;
        if (state.chapterTopics[chapterId]) {
            state.chapterTopics[chapterId].loading = false;
            state.chapterTopics[chapterId].error = action.payload;
        }
      })
      
      // Fetch chapter notes
      .addCase(fetchChapterNotes.pending, (state, action) => {
        const { chapterId } = action.meta.arg;
        if (!state.chapterNotes[chapterId]) {
          state.chapterNotes[chapterId] = { notes: [], loading: true, error: null };
        } else {
          state.chapterNotes[chapterId].loading = true;
        }
      })
      .addCase(fetchChapterNotes.fulfilled, (state, action) => {
        const { chapterId, data } = action.payload;
        state.chapterNotes[chapterId] = {
          notes: Array.isArray(data?.data) ? data.data : (Array.isArray(data) ? data : []),
          loading: false,
          error: null,
        };
      })
      .addCase(fetchChapterNotes.rejected, (state, action) => {
        const { chapterId, error } = action.payload || {};
        if (chapterId && state.chapterNotes[chapterId]) {
          state.chapterNotes[chapterId].loading = false;
          state.chapterNotes[chapterId].error = error || 'Failed to fetch notes';
        }
      });
  },
});

export const { clearError, setSelectedChapter, clearChapters } = chaptersSlice.actions;

// Selectors
export const selectChapters = (state) => state.chapters.chapters;

// Legacy selector - returns empty array to prevent crash but should be replaced
export const selectTopics = (state) => []; 

// New keyed selector
const defaultChapterTopics = { topics: [], loading: false, error: null };
export const selectTopicsForChapter = (chapterId) => (state) => 
    state.chapters.chapterTopics[chapterId] || defaultChapterTopics;

export const selectSelectedChapter = (state) => state.chapters.selectedChapter;
export const selectChaptersLoading = (state) => state.chapters.loading;
export const selectChaptersError = (state) => state.chapters.error;

// Selector default value for stability
const defaultChapterNotes = { notes: [], loading: false, error: null };

export const selectChapterNotes = (chapterId) => (state) => 
  state.chapters.chapterNotes[chapterId] || defaultChapterNotes;

export default chaptersSlice.reducer;
