import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import API from '../../api/api';

// Async thunk for fetching rankings
export const fetchRankings = createAsyncThunk(
  'rankings/fetch',
  async ({ limit = 20, userId }, { rejectWithValue }) => {
    try {
      const response = await API.post('/rankings', {
        limit,
        user_id: userId
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to fetch rankings');
    }
  }
);

// Initial state
const initialState = {
  topRankings: [],
  userRank: null,
  totalUsers: 0,
  loading: false,
  error: null,
};

// Rankings slice
const rankingsSlice = createSlice({
  name: 'rankings',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch rankings
      .addCase(fetchRankings.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRankings.fulfilled, (state, action) => {
        state.loading = false;
        state.topRankings = action.payload.top || [];
        state.userRank = action.payload.rank;
        state.totalUsers = action.payload.totalUsers || 0;
      })
      .addCase(fetchRankings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError } = rankingsSlice.actions;

// Selectors
export const selectTopRankings = (state) => state.rankings.topRankings;
export const selectUserRank = (state) => state.rankings.userRank;
export const selectTotalUsers = (state) => state.rankings.totalUsers;
export const selectRankingsLoading = (state) => state.rankings.loading;
export const selectRankingsError = (state) => state.rankings.error;

export default rankingsSlice.reducer;
