import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import API from '../../api/api';

// Async thunks for mock tests
export const fetchAllMockTests = createAsyncThunk(
  'mockTests/fetchAll',
  async (_, { rejectWithValue, getState }) => {
    try {
      const state = getState();
      // Try to get user_id from user object - could be 'id', 'user_id', or 'uuid'
      const user_id = state.auth.user?.user_id || state.auth.user?.id || state.auth.user?.uuid;
      
      // Send user_id if available, otherwise send empty object
      const response = await API.post('/mock-tests', user_id ? { user_id } : {});
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to fetch mock tests');
    }
  }
);

export const fetchMockTestsByCourse = createAsyncThunk(
  'mockTests/fetchByCourse',
  async (courseId, { rejectWithValue, getState }) => {
    try {
      const state = getState();
      // Try to get user_id from user object - could be 'id', 'user_id', or 'uuid'
      const user_id = state.auth.user?.user_id || state.auth.user?.id || state.auth.user?.uuid;
      
      if (!user_id) {
      return rejectWithValue('User not loaded yet');
    }
      // Send user_id if available, otherwise send empty object
      const response = await API.post(`/mobile/mock-tests`, user_id ? { course_id:courseId, user_id } : {});
      
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to fetch mock tests');
    }
  }
);

export const startMockTest = createAsyncThunk(
  'mockTests/start',
  async (testId, { rejectWithValue, getState }) => {
    try {
      const state = getState();

      if (!state.auth.user) {
        return rejectWithValue('User not loaded yet');
      }

      // Try to get user_id from user object - could be 'id', 'user_id', or 'uuid'
      const user_id = state.auth.user?.user_id || state.auth.user?.id || state.auth.user?.uuid;
      
      const response = await API.post(`/mobile/mock-tests/${testId}/start`, user_id ? { user_id } : {});
        
      return response.data; 
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to start mock test');
    }
  }
);

// export const submitMockTest = createAsyncThunk(
//   'mockTests/submit',
//   async (submissionData, { rejectWithValue, getState }) => {
//     try {
//       const state = getState();
//       // Get user_id from auth state if not provided
//       let user_id = submissionData.user_id;
//       if (!user_id) {
//         user_id = state.auth.user?.user_id || state.auth.user?.id || state.auth.user?.uuid;
//       }
      
//       const { testId, ...rest } = submissionData;
//       const dataToSend = {
//         ...rest,
//         user_id
//       };
      
//       const response = await API.post(`/mock-tests/${testId}/submit`, dataToSend);
//       return response.data;
//     } catch (error) {
//       return rejectWithValue(error.response?.data?.error || 'Failed to submit mock test');
//     }
//   }
// );






// export const submitMockTest = createAsyncThunk(
//   'mockTests/submit',
//   async ({ attempt_id, answers, time_taken_seconds, user_id }, { rejectWithValue }) => {
//     try {



//       if (!attempt_id) throw new Error('Attempt ID is required');

//       const response = await API.post(`/mock-tests/${attempt_id}/submit`, {
//         attempt_id,
//         user_id,
//         answers,
//         time_taken_seconds
//       });

//       return response.data;
//     } catch (err) {
//       return rejectWithValue(err.response?.data?.error || err.message || 'Failed to submit mock test');
//     }
//   }
// );


// export const fetchMockTestResult = createAsyncThunk(
//   'mockTests/fetchResult',
//   async ({ testId, attempt_id }, { rejectWithValue }) => {
//     try {

//        const state = getState();

//       if (!state.auth.user) {
//         return rejectWithValue('User not loaded yet');
//       }


//       if (!attempt_id) {
//         throw new Error('attempt_id is required to fetch result');
//       }

//       const response = await API.post(
//         `/mock-tests/${testId}/result`,
//         { attempt_id } // ✅ ONLY this
//       );

//       return response.data;
//     } catch (error) {
//       return rejectWithValue(
//         error.response?.data?.error || error.message || 'Failed to fetch mock test result'
//       );
//     }
//   }
// );




export const submitMockTest = createAsyncThunk(
  'mockTests/submit',
  async ({ user_id, test_id,time_taken_seconds , answers }, { rejectWithValue, getState }) => {
    
    
    
      
    try {
      // const state = getState();

      // const finalAttemptId = attempt_id || state.mockTests.currentMockTest?.attempt?.id;

      // const finalUserId = user_id ||
      //   state.auth.user?.user_id ||
      //   state.auth.user?.id ||
      //   state.auth.user?.uuid;
        
      // const finalTestId = test_id || state.mockTests.currentMockTest?.test?.id || state.mockTests.currentMockTest?.id;

      // if (!finalAttemptId) return rejectWithValue('Attempt ID missing');
      // if (!finalUserId) return rejectWithValue('User not loaded');

      const response = await API.post(`/mobile/mock-tests/${test_id}/submit`, {
        user_id: user_id,
        time_taken_seconds:time_taken_seconds,
        answers:answers,
      });
       
      return response.data;
    } catch (err) {
      
      return rejectWithValue(
        err.response?.data?.error || err.message
      );
    }
  }
);

export const fetchMockTestResult = createAsyncThunk(
  'mockTests/fetchResult',
  async ({ attempt_id, user_id }, { rejectWithValue }) => {
    try {
    

      
      if (!user_id) {
        throw new Error('user_id is required to fetch result');
      }
      
      const response = await API.post(`/mobile/mock-tests/${attempt_id}/result`,
        { user_id }
      );

      

      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.error || error.message || 'Failed to fetch mock test result'
      );
    }
  }
);



// Initial state
const initialState = {
  mockTests: [],
  courseMockTests: [],
  currentMockTest: null,
  mockTestResult: null,
  loading: false,
  error: null,
};

// Mock tests slice
const mockTestsSlice = createSlice({
  name: 'mockTests',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearMockTests: (state) => {
      state.mockTests = [];
      state.courseMockTests = [];
      state.currentMockTest = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch all mock tests
      .addCase(fetchAllMockTests.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllMockTests.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload.success && Array.isArray(action.payload.tests)) {
          state.mockTests = action.payload.tests;
        } else {
          state.mockTests = [];
        }
      })
      .addCase(fetchAllMockTests.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Fetch mock tests by course
      .addCase(fetchMockTestsByCourse.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMockTestsByCourse.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload.success && Array.isArray(action.payload.tests)) {
          state.courseMockTests = action.payload.tests;
        } else {
          state.courseMockTests = [];
        }
      })
      .addCase(fetchMockTestsByCourse.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Start mock test
      .addCase(startMockTest.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(startMockTest.fulfilled, (state, action) => {
        state.loading = false;
        // Store the entire response, which should include questions at the top level
        // The response structure should have: { attempt, test, questions, ... }
        const data = action.payload;
        state.currentMockTest = {
          ...data,
          // Ensure questions are available at the top level for easy access
          questions: data.questions || data.test?.questions || []
        };
      })
      .addCase(startMockTest.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Submit mock test
      .addCase(submitMockTest.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(submitMockTest.fulfilled, (state, action) => {
        state.loading = false;
        state.currentMockTest = action.payload;
      })
      .addCase(submitMockTest.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Fetch mock test result
      .addCase(fetchMockTestResult.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMockTestResult.fulfilled, (state, action) => {
        state.loading = false;
        state.mockTestResult = action.payload;
      })
      .addCase(fetchMockTestResult.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError, clearMockTests } = mockTestsSlice.actions;

// Selectors
export const selectAllMockTests = (state) => state.mockTests.mockTests;
export const selectCourseMockTests = (state) => state.mockTests.courseMockTests;
export const selectCurrentMockTest = (state) => state.mockTests.currentMockTest;
export const selectMockTestResult = (state) => state.mockTests.mockTestResult;
export const selectMockTestsLoading = (state) => state.mockTests.loading;
export const selectMockTestsError = (state) => state.mockTests.error;

export default mockTestsSlice.reducer;
