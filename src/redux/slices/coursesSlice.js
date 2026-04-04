import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import API from '../../api/api';

// Async thunks for courses
export const fetchAllCourses = createAsyncThunk(
  'courses/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const response = await API.get('/courses');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to fetch courses');
    }
  }
);

export const fetchCoursesWithPlans = createAsyncThunk(
  'courses/fetchWithPlans',
  async (_, { rejectWithValue }) => {
    try {
      const response = await API.get('/mobile/courses');
      
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to fetch courses');
    }
  }
);

export const fetchCourseDetails = createAsyncThunk(
  'courses/fetchDetails',
  async (courseId, { rejectWithValue }) => {
    try {
      const response = await API.get(`/courses/${courseId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to fetch course details');
    }
  }
);

export const enrollInCourse = createAsyncThunk(
  'courses/enroll',
  async (enrollmentData, { rejectWithValue }) => {
    try {
      const response = await API.post('/mobile/enroll', enrollmentData);
      
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to enroll in course');
    }
  }
);

export const fetchEnrolledCourses = createAsyncThunk(
  'courses/fetchEnrolled',
  async (userId, { rejectWithValue }) => {
    try {
      
      // Use the new API endpoint as requested
      const response = await API.post('/user/get', {
        id: userId
      });
      
      return response.data;
    } catch (error) {
      console.error("Fetch enrolled courses error:", error.response?.data);
      return rejectWithValue(error.response?.data?.error || 'Failed to fetch enrolled courses');
    }
  }
);

// Initial state
const initialState = {
  courses: [],
  plans: [],
  selectedCourse: null,
  enrolledCourses: [],
  enrollment: null,
  loading: false,
  error: null,
};

// Courses slice
const coursesSlice = createSlice({
  name: 'courses',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearSelectedCourse: (state) => {
      state.selectedCourse = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch all courses
      .addCase(fetchAllCourses.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllCourses.fulfilled, (state, action) => {
        state.loading = false;
        if (Array.isArray(action.payload)) {
          state.courses = action.payload;
        } else {
           state.courses = [];
        }
      })
      .addCase(fetchAllCourses.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Fetch courses with plans
      .addCase(fetchCoursesWithPlans.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCoursesWithPlans.fulfilled, (state, action) => {
        state.loading = false;
        
        // Robust check for courses array
        // Check if response has {success: true, data: [...]} format (most common)
        if (action.payload && Array.isArray(action.payload.data)) {
          state.courses = action.payload.data;
          state.plans = [];
        } else if (Array.isArray(action.payload)) {
          state.courses = action.payload;
          state.plans = [];
        } else if (action.payload && Array.isArray(action.payload.courses)) {
          state.courses = action.payload.courses;
          state.plans = action.payload.plans || [];
        } else {
          console.warn('Unexpected courses API format:', action.payload);
          state.courses = [];
          state.plans = [];
        }
      })
      .addCase(fetchCoursesWithPlans.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Fetch course details
      .addCase(fetchCourseDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCourseDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedCourse = action.payload;
      })
      .addCase(fetchCourseDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Enroll in course
      .addCase(enrollInCourse.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(enrollInCourse.fulfilled, (state, action) => {
        state.loading = false;
        state.enrollment = action.payload;
      })
      .addCase(enrollInCourse.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Fetch enrolled courses
      .addCase(fetchEnrolledCourses.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchEnrolledCourses.fulfilled, (state, action) => {
        state.loading = false;
        
        
        if (action.payload && Array.isArray(action.payload.subscriptions)) {
          state.enrolledCourses = action.payload.subscriptions;
        } else if (action.payload?.user && Array.isArray(action.payload.user.subscriptions)) {
          state.enrolledCourses = action.payload.user.subscriptions;
        } else if (action.payload?.user && Array.isArray(action.payload.user.enrolled_courses)) {
          state.enrolledCourses = action.payload.user.enrolled_courses;
        } else if (Array.isArray(action.payload)) {
          state.enrolledCourses = action.payload;
        } else if (action.payload && Array.isArray(action.payload.data)) {
          state.enrolledCourses = action.payload.data;
        } else {
          console.warn('coursesSlice: Unexpected enrolled courses format:', action.payload);
          state.enrolledCourses = [];
        }
        
      })
      .addCase(fetchEnrolledCourses.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Clear courses on logout
      .addMatcher(
        (action) => action.type === 'auth/logout/fulfilled',
        (state) => {
          state.enrolledCourses = [];
          state.error = null;
          state.loading = false;
        }
      );
  },
});

export const { clearError, clearSelectedCourse } = coursesSlice.actions;

// Selectors
export const selectCourses = (state) => state.courses.courses;
export const selectPlans = (state) => state.courses.plans;
export const selectSelectedCourse = (state) => state.courses.selectedCourse;
export const selectEnrolledCourses = (state) => state.courses.enrolledCourses;
export const selectEnrollment = (state) => state.courses.enrollment;
export const selectCoursesLoading = (state) => state.courses.loading;
export const selectCoursesError = (state) => state.courses.error;

export default coursesSlice.reducer;
