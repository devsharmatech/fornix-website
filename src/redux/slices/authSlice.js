import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import API from '../../api/api';

// Async thunks for authentication
export const registerUser = createAsyncThunk(
  'auth/register',
  async (formData, { rejectWithValue }) => {
    try {
      // Use production URL for registration
      const response = await API.post('/auth/register', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      return response.data;
    } catch (error) {
      console.error('Registration API error:', error.response?.data);
      return rejectWithValue(error.response?.data?.error || 'Registration failed');
    }
  }
);

export const registerUserWithPlan = createAsyncThunk(
  'auth/registerWithPlan',
  async (jsonData, { rejectWithValue }) => {
    try {
      // Use production URL for registration with plan
      const response = await API.post('/auth/register-with-plan', jsonData);
      
      return response.data;
    } catch (error) {
      console.error('Registration with plan API error:', error.response?.data);
      return rejectWithValue(error.response?.data?.error || 'Registration with plan failed');
    }
  }
);

export const registerFreeUser = createAsyncThunk(
  'auth/registerFree',
  async (jsonData, { rejectWithValue }) => {
    try {
      const response = await API.post('/auth/register-free', jsonData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Free registration failed');
    }
  }
);

export const loginUser = createAsyncThunk(
  'auth/login',
  async (credentials, { rejectWithValue }) => {
    try {
      // Transform email to identifier as backend expects
      const loginData = {
        identifier: credentials.email || credentials.identifier,
        password: credentials.password,
      };
          
      
      // Use local backend for login
      const response = await API.post('/auth/login', loginData);
      
      
      const { token, user } = response.data;
      
      // Store token in localStorage
      localStorage.setItem('token', token);
      
      return { token, user };
    } catch (error) {
      console.error('Login error:', error.response?.data);
      const errorMessage = error.response?.data?.message 
        || error.response?.data?.error 
        || error.response?.data?.msg
        || 'Login failed';
      return rejectWithValue(errorMessage);
    }
  }
);

export const logoutUser = createAsyncThunk(
  'auth/logout',
  async (_, { rejectWithValue }) => {
    try {
      // Clear token from localStorage
      localStorage.removeItem('token');
      return null;
    } catch (error) {
      return rejectWithValue('Logout failed');
    }
  }
);

export const fetchUserProfile = createAsyncThunk(
  'auth/profile',
  async (_, { rejectWithValue }) => {
    try {
      const response = await API.get('/auth/profile');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to fetch profile');
    }
  }
);

export const googleLogin = createAsyncThunk(
  'auth/googleLogin',
  async (credential, { rejectWithValue }) => {
    try {
      // Send Google credential to backend for verification
      const response = await API.post('/auth/google', {
        credential
      });
      
      const { token, user } = response.data;
      
      // Store token in localStorage
      localStorage.setItem('token', token);
      
      return { token, user };
    } catch (error) {
      console.error('Google login error:', error.response?.data);
      const errorMessage = error.response?.data?.error || 'Google login failed';
      return rejectWithValue(errorMessage);
    }
  }
);

// Password Reset Thunks
export const requestPasswordReset = createAsyncThunk(
  'auth/requestPasswordReset',
  async (email, { rejectWithValue }) => {
    try {
      const response = await API.post('/auth/password-reset/request', { email });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to send OTP');
    }
  }
);

export const verifyPasswordResetOTP = createAsyncThunk(
  'auth/verifyPasswordResetOTP',
  async ({ email, otp }, { rejectWithValue }) => {
    try {
      const response = await API.post('/auth/password-reset/verify', { email, otp });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Invalid OTP');
    }
  }
);

export const updatePassword = createAsyncThunk(
  'auth/updatePassword',
  async ({ email, otp, new_password }, { rejectWithValue }) => {
    try {
      const response = await API.post('/auth/password-reset/update', { email, otp, new_password });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update password');
    }
  }
);


// Initial state
const initialState = {
  user: JSON.parse(localStorage.getItem('user') || 'null'),
  token: localStorage.getItem('token') || null,
  isAuthenticated: !!localStorage.getItem('token'),
  loading: false,
  error: null,
};

// Auth slice
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setCredentials: (state, action) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isAuthenticated = true;
    },
  },
  extraReducers: (builder) => {
    builder
      // Register user
  
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Register user with plan
      .addCase(registerUserWithPlan.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUserWithPlan.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(registerUserWithPlan.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Register free user
      .addCase(registerFreeUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerFreeUser.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(registerFreeUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      
      // Login user
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
        state.error = null;
        try {
          localStorage.setItem('user', JSON.stringify(action.payload.user));
        } catch (e) {
          console.warn('Failed to persist user to localStorage', e);
        }
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.isAuthenticated = false;
      })
      
      // Logout user
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
        state.loading = false;
        state.error = null;
        try {
          localStorage.removeItem('user');
          localStorage.removeItem('token');
        } catch (e) {
          console.warn('Failed to clear localStorage on logout', e);
        }
      })
      
      // Fetch user profile
      .addCase(fetchUserProfile.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchUserProfile.fulfilled, (state, action) => {
        state.loading = false;
        // Correctly unpack user object if wrapped in { success, user }
        state.user = (action.payload?.success && action.payload?.user) 
          ? action.payload.user 
          : (action.payload?.user || action.payload);
        
        // Persist the clean user object
        try {
          localStorage.setItem('user', JSON.stringify(state.user));
        } catch (e) {
          console.warn('Failed to persist user to localStorage', e);
        }
      })
      .addCase(fetchUserProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        // If profile fetch fails (e.g., token expired), clear auth state
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
        try {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
        } catch (e) {
          console.warn('Failed to clear localStorage after profile fetch failure', e);
        }
      })
      
      // Google login
      .addCase(googleLogin.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(googleLogin.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
        state.error = null;
        try {
          localStorage.setItem('user', JSON.stringify(action.payload.user));
        } catch (e) {
          console.warn('Failed to persist user to localStorage', e);
        }
      })
      .addCase(googleLogin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.isAuthenticated = false;
      });
  },
});

export const { clearError, setCredentials } = authSlice.actions;

// Selectors
export const selectAuth = (state) => state.auth;
export const selectUser = (state) => state.auth.user;
export const selectIsAuthenticated = (state) => state.auth.isAuthenticated;
export const selectAuthLoading = (state) => state.auth.loading;
export const selectAuthError = (state) => state.auth.error;

export default authSlice.reducer;
