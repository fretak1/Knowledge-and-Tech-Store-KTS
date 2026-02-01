// store/useNotificationStore.ts
import { create } from "zustand";
import axios from "axios";
import { API_ROUTES, createApi } from "../lib/api";

// Configure axios base URL if not already set globally
const axiosInstance = createApi(API_ROUTES.NOTIFICATIONS);

interface Notification {
  id: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}

interface NotificationState {
  notifications: Notification[];
  unreadCount: number;
  isLoading: boolean;
  getNotifications: () => Promise<void>;
  markAllAsRead: () => Promise<void>; 
}

export const useNotificationStore = create<NotificationState>((set, get) => ({
  notifications: [],
  unreadCount: 0,
  isLoading: false,

  getNotifications: async () => {
    set({ isLoading: true });
    try {
      const { data } = await axiosInstance.get("/get");
      set({
        notifications: data,
        unreadCount: data.filter((n: Notification) => !n.isRead).length,
        isLoading: false
      });
    } catch (error) {
      set({ isLoading: false });
    }
  },

  markAllAsRead: async () => {
    try {
      // You would need to create a specific endpoint for this in Express
      console.log("marking all as read");
      await axiosInstance.patch("/markAllAsRead");
      const updated = get().notifications.map(n => ({ ...n, isRead: true }));
      set({ notifications: updated, unreadCount: 0 });
    } catch (error) {
      console.error("Error marking all as read", error);
    }
  }
}));