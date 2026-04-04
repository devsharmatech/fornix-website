import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import API from '../../api/api';

// Async thunk to fetch home page data
export const fetchHomeData = createAsyncThunk(
  'home/fetchData',
  async (_, { rejectWithValue }) => {
    try {
      const response = await API.get('/home');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to fetch home data');
    }
  }
);

// Initial state
const initialState = {
  hero: null,
  stats: null,
  featuredCourses: [],
  testimonials: [],
  features: [],
  loading: false,
  error: null,
};

// Home slice
const homeSlice = createSlice({
  name: 'home',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchHomeData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchHomeData.fulfilled, (state, action) => {
        state.loading = false;
        state.hero = action.payload.hero;
        state.stats = action.payload.stats;
        state.featuredCourses = action.payload.featuredCourses;
        state.testimonials = action.payload.testimonials;
        state.features = action.payload.features;
      })
      .addCase(fetchHomeData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError } = homeSlice.actions;

// Selectors
export const selectHero = (state) => state.home.hero;
export const selectStats = (state) => state.home.stats;
export const selectFeaturedCourses = (state) => state.home.featuredCourses;
export const selectTestimonials = (state) => state.home.testimonials;
export const selectFeatures = (state) => state.home.features;
export const selectHomeLoading = (state) => state.home.loading;
export const selectHomeError = (state) => state.home.error;

export default homeSlice.reducer;
