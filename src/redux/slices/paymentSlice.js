import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import API from '../../api/api';

// Async thunk to create Razorpay order
export const createPaymentOrder = createAsyncThunk(
  'payment/createOrder',
  async (orderData, { rejectWithValue }) => {
    try {
      const response = await API.post('/payment/create-order', orderData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to create payment order');
    }
  }
);

// Async thunk to verify payment
export const verifyPayment = createAsyncThunk(
  'payment/verify',
  async (paymentData, { rejectWithValue }) => {
    try {
      const response = await API.post('/payment/verify', paymentData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to verify payment');
    }
  }
);

// Initial state
const initialState = {
  order: null,
  loading: false,
  error: null,
  paymentSuccess: false,
  enrollment: null,
};

// Payment slice
const paymentSlice = createSlice({
  name: 'payment',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearPaymentState: (state) => {
      state.order = null;
      state.paymentSuccess = false;
      state.enrollment = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Create payment order
      .addCase(createPaymentOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createPaymentOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.order = action.payload;
      })
      .addCase(createPaymentOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Verify payment
      .addCase(verifyPayment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(verifyPayment.fulfilled, (state, action) => {
        state.loading = false;
        state.paymentSuccess = action.payload.success;
        
        // Handle different response structures for enrollment
        if (action.payload.success === true && action.payload.enrollment) {
          state.enrollment = action.payload.enrollment;
        } else if (action.payload.payment) {
          state.enrollment = action.payload.payment;
        } else {
          state.enrollment = null;
        }
      })
      .addCase(verifyPayment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.paymentSuccess = false;
      });
  },
});

export const { clearError, clearPaymentState } = paymentSlice.actions;

// Selectors
export const selectPaymentOrder = (state) => state.payment.order;
export const selectPaymentLoading = (state) => state.payment.loading;
export const selectPaymentError = (state) => state.payment.error;
export const selectPaymentSuccess = (state) => state.payment.paymentSuccess;
export const selectEnrollment = (state) => state.payment.enrollment;

export default paymentSlice.reducer;
