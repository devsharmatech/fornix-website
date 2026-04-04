import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import API from '../../api/api';

// Fetch notifications
export const fetchNotifications = createAsyncThunk(
  'notifications/fetchAll',
  async ({ userId, page = 1, limit = 20 }, { rejectWithValue }) => {
    try {
      const response = await API.get(`/notifications/get?user_id=${userId}&page=${page}&limit=${limit}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Mark as read (single or all)
export const markAsRead = createAsyncThunk(
  'notifications/markRead',
  async ({ userId, notificationId }, { rejectWithValue }) => {
    try {
      const body = { user_id: userId };
      if (notificationId) body.notification_id = notificationId;

      const response = await API.put('/notifications/mark-read', body);
      return { 
        notificationId, 
        all: !notificationId, 
        data: response.data 
      };
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Delete notification (single or all)
export const deleteNotifications = createAsyncThunk(
  'notifications/delete',
  async ({ userId, notificationId }, { rejectWithValue }) => {
    try {
      const body = { user_id: userId };
      if (notificationId) body.notification_id = notificationId;

      const response = await API.delete('/notifications/delete', { data: body });
      return { 
        notificationId, 
        all: !notificationId, 
        data: response.data 
      };
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const notificationSlice = createSlice({
  name: 'notifications',
  initialState: {
    items: [],
    unreadCount: 0,
    loading: false,
    error: null,
  },
  reducers: {
    addNotification: (state, action) => {
      state.items.unshift(action.payload);
      state.unreadCount += 1;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchNotifications.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchNotifications.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.data || [];
        state.unreadCount = state.items.filter(n => !n.is_read).length;
      })
      .addCase(fetchNotifications.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(markAsRead.fulfilled, (state, action) => {
        if (action.payload.all) {
          state.items.forEach(n => n.is_read = true);
          state.unreadCount = 0;
        } else {
          const item = state.items.find(n => (n.id === action.payload.notificationId || n._id === action.payload.notificationId));
          if (item && !item.is_read) {
            item.is_read = true;
            state.unreadCount -= 1;
          }
        }
      })
      .addCase(deleteNotifications.fulfilled, (state, action) => {
        if (action.payload.all) {
          state.items = [];
          state.unreadCount = 0;
        } else {
          state.items = state.items.filter(n => (n.id !== action.payload.notificationId && n._id !== action.payload.notificationId));
          state.unreadCount = state.items.filter(n => !n.is_read).length;
        }
      });
  }
});

export const { addNotification } = notificationSlice.actions;
export const selectNotifications = (state) => state.notifications.items;
export const selectUnreadCount = (state) => state.notifications.unreadCount;

export default notificationSlice.reducer;
