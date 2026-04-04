import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import API from '../../api/api';

// Async thunks for user management
export const fetchUserDetails = createAsyncThunk(
  'user/fetchDetails',
  async (userId, { rejectWithValue }) => {
    try {
      const response = await API.post('/user/get', { id: userId });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to fetch user details');
    }
  }
);

export const updateUserProfile = createAsyncThunk(
  'user/updateProfile',
  async (profileData, { rejectWithValue }) => {
    try {
      const response = await API.put('/user/update', profileData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to update profile');
    }
  }
);

export const deleteUserAccount = createAsyncThunk(
  'user/deleteAccount',
  async (userId, { rejectWithValue }) => {
    try {
      const response = await API.delete('/user/delete', { data: { id: userId } });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to delete account');
    }
  }
);

// Initial state
const initialState = {
  profile: null,
  loading: false,
  error: null,
};

// User slice
const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearProfile: (state) => {
      state.profile = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch user details
      .addCase(fetchUserDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserDetails.fulfilled, (state, action) => {
        state.loading = false;
        // Handle different response formats
        if (action.payload && action.payload.user) {
          // Merge user data with subscriptions
          // Check multiple potential locations for subscriptions
          const subscriptions = action.payload.subscriptions || 
                                action.payload.user.subscriptions || 
                                action.payload.user.enrolled_courses || 
                                [];
          
          const hasActiveSub = subscriptions.some(s => s.is_active || s.status === 'active' || !!s.id);
          
          state.profile = {
            ...action.payload.user,
            subscriptions: subscriptions,
            has_active_subscription: hasActiveSub,
            // If they have any valid subscription data, consider them paid for UI purposes
            student_type: (hasActiveSub || subscriptions.length > 0) ? 'paid' : 
                         (action.payload.user.role === 'user' ? 'free' : action.payload.user.role)
          };
          
          // Also try to set course_id from active subscription if missing
          if (!state.profile.course_id && subscriptions.length > 0) {
             const activeSub = subscriptions.find(s => s.is_active || s.status === 'active') || subscriptions[0];
             if (activeSub) state.profile.course_id = activeSub.course_id || activeSub.id;
          }
          
        } else if (action.payload?.user) {
          state.profile = action.payload.user;
        } else {
          state.profile = action.payload;
        }
      })
      .addCase(fetchUserDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Update profile
      .addCase(updateUserProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        state.loading = false;
        
        
        // Merge the updated data with existing profile
        if (action.payload.success && action.payload.user) {
          state.profile = action.payload.user;
        } else if (action.payload.user) {
          state.profile = action.payload.user;
        } else {
          // If API just returns success, merge the request data with existing profile
          state.profile = { ...state.profile, ...action.meta.arg };
        }
        
      })
      .addCase(updateUserProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Delete account
      .addCase(deleteUserAccount.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteUserAccount.fulfilled, (state) => {
        state.loading = false;
        state.profile = null;
      })
      .addCase(deleteUserAccount.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Clear profile on logout
      .addMatcher(
        (action) => action.type === 'auth/logout/fulfilled',
        (state) => {
          state.profile = null;
          state.error = null;
          state.loading = false;
        }
      );
  },
});

export const { clearError, clearProfile } = userSlice.actions;

// Selectors
export const selectUserProfile = (state) => state.user.profile;
export const selectUserLoading = (state) => state.user.loading;
export const selectUserError = (state) => state.user.error;

export default userSlice.reducer;
