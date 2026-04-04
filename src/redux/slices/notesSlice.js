import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import API from '../../api/api';

// Async thunk for notes
export const fetchNotesByCourse = createAsyncThunk(
  'notes/fetchByCourse',
  async (courseId, { rejectWithValue }) => {
    try {
      const response = await API.post('/notes', { course_id: courseId });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to fetch notes');
    }
  }
);

export const fetchNotes = createAsyncThunk(
  'notes/fetch',
  async (payload, { rejectWithValue }) => {
    try {
      // payload should be { course_id, subject_id, note_type }
      const response = await API.post('/notes', payload);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to fetch notes');
    }
  }
);

// Initial state
const initialState = {
  notes: [],
  loading: false,
  error: null,
};

// Notes slice
const notesSlice = createSlice({
  name: 'notes',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearNotes: (state) => {
      state.notes = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchNotesByCourse.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchNotesByCourse.fulfilled, (state, action) => {
        state.loading = false;
        state.notes = action.payload;
      })
      .addCase(fetchNotesByCourse.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Fetch notes (by topic or all)
      .addCase(fetchNotes.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchNotes.fulfilled, (state, action) => {
        state.loading = false;
        state.notes = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(fetchNotes.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError, clearNotes } = notesSlice.actions;

// Selectors
export const selectNotes = (state) => state.notes.notes;
export const selectNotesLoading = (state) => state.notes.loading;
export const selectNotesError = (state) => state.notes.error;

export default notesSlice.reducer;
