import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import API from '../../api/api';

// Async thunk for fetching discussions
export const fetchDiscussions = createAsyncThunk(
  'discussions/fetch',
  async (courseId, { rejectWithValue }) => {
    try {
      const response = await API.post('/mobile/discussions', {
        course_id: courseId
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to fetch discussions');
    }
  }
);

// Async thunk for fetching discussion posts
export const fetchDiscussionPosts = createAsyncThunk(
  'discussions/fetchPosts',
  async (discussionId, { rejectWithValue }) => {
    try {
      const response = await API.get(`/discussions/${discussionId}/posts`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to fetch discussion posts');
    }
  }
);

// Initial state
const initialState = {
  discussions: [],
  currentDiscussionPosts: [],
  loading: false,
  postsLoading: false,
  error: null,
};

// Discussions slice
const discussionsSlice = createSlice({
  name: 'discussions',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch discussions
      .addCase(fetchDiscussions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDiscussions.fulfilled, (state, action) => {
        state.loading = false;
        state.discussions = action.payload.data || [];
      })
      .addCase(fetchDiscussions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Fetch discussion posts
      .addCase(fetchDiscussionPosts.pending, (state) => {
        state.postsLoading = true;
        state.error = null;
      })
      .addCase(fetchDiscussionPosts.fulfilled, (state, action) => {
        state.postsLoading = false;
        // Filter out deleted posts
        state.currentDiscussionPosts = (action.payload.data || []).filter(post => !post.deleted);
      })
      .addCase(fetchDiscussionPosts.rejected, (state, action) => {
        state.postsLoading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError } = discussionsSlice.actions;

// Selectors
export const selectDiscussions = (state) => state.discussions.discussions;
export const selectDiscussionsLoading = (state) => state.discussions.loading;
export const selectDiscussionsError = (state) => state.discussions.error;
export const selectCurrentDiscussionPosts = (state) => state.discussions.currentDiscussionPosts;
export const selectPostsLoading = (state) => state.discussions.postsLoading;

export default discussionsSlice.reducer;
