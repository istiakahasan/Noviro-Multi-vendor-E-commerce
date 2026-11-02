// redux/features/notificationSlice.ts
import { createSlice, createSelector } from '@reduxjs/toolkit';
// import { notificationApi } from '@/services/notificationApi';
import { Notification } from '@/types/notification.type';
import { notificationApi } from '../api/notificationApi';

interface NotificationState {
  selectedNotification: Notification | null;
}

const initialState: NotificationState = {
  selectedNotification: null,
};

const notificationSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    setSelectedNotification: (state, action) => {
      state.selectedNotification = action.payload;
    },
    clearSelectedNotification: (state) => {
      state.selectedNotification = null;
    },
  },
});

export const { setSelectedNotification, clearSelectedNotification } = notificationSlice.actions;

// Selectors
export const selectNotifications = createSelector(
  [(state) => state.notifications],
  (notificationsState) => notificationsState
);

export const selectUnreadCount = createSelector(
  [(state) => notificationApi.endpoints.getAllNotification.select()(state)],
  (result) => {
    const notifications = (Array.isArray(result?.data?.data) ? result?.data?.data : []) as Notification[];
    return notifications.filter((n: Notification) => !n.isRead).length;
  }
);

export default notificationSlice.reducer;