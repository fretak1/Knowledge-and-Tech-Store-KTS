import { create } from "zustand";
import axios from "axios";
import { API_ROUTES, createApi } from "@/lib/api";



export interface Message {
    id: string;
    name: string;
    message: string;
    status: string;
    createdAt: string;
    updatedAt: string;
}

interface MessageState {
    messages: Message[];
    isLoading: boolean;
    error: string | null;
    unreadCountForAdmin: number;
    unreadCountForMember: number;
    message: Message | null;
    getMessages: () => Promise<void>;
    getUnreadCount: () => Promise<void>;
    markAllAsRead: () => Promise<void>;
    deleteMessage: (id: string) => Promise<boolean>;
    sendMessages: (name: string, message: string) => Promise<boolean>;
}

const axiosInstance = createApi(API_ROUTES.MESSAGES);

export const useMessageStore = create<MessageState>((set) => ({
    messages: [],
    isLoading: false,
    error: null,
    unreadCountForAdmin: 0,
    unreadCountForMember: 0,
    message: null,
    getMessages: async () => {
        set({ isLoading: true, error: null });
        try {
            const res = await axiosInstance.get('/getMessages');
            const data = res.data;
            set({ messages: data });
        } catch (error) {
            set({ error: 'Failed to fetch messages' });
        } finally {
            set({ isLoading: false });
        }
    },

    getUnreadCount: async () => {
        set({ isLoading: true, error: null });
        try {
            const res = await axiosInstance.get('/getUnreadCount');
            const { role, count } = res.data;

            set((state) => ({
                unreadCountForAdmin:
                    role === "ADMIN" ? count : state.unreadCountForAdmin,

                unreadCountForMember:
                    role === "MEMBER" ? count : state.unreadCountForMember,
            }));
        } catch (error) {
            set({ error: 'Failed to fetch unread count' });
        } finally {
            set({ isLoading: false });
        }
    },




    markAllAsRead: async () => {
        set({ isLoading: true });
        try {
            // Assuming your backend has an endpoint to bulk update status
            const res = await axiosInstance.patch('/markAllAsRead');
            const { role } = res.data;

            set((state) => ({
                unreadCountForAdmin:
                    role === "ADMIN" ? 0 : state.unreadCountForAdmin,

                unreadCountForMember:
                    role === "MEMBER" ? 0 : state.unreadCountForMember,
            }));
            set((state) => ({
                messages: state.messages.map(m => ({ ...m, status: 'read' }))
            }));
        } catch (error) {
            console.error("Failed to mark all as read", error);
        } finally {
            set({ isLoading: false });
        }
    },


    deleteMessage: async (id: string) => {
        set({ isLoading: true, error: null });
        try {
            const res = await axiosInstance.delete(`/deleteMessage/${id}`);
            const data = res.data.success;
            return data;
        } catch (error) {
            set({ error: 'Failed to delete message' });
        } finally {
            set({ isLoading: false });
        }
    },


    sendMessages: async (name: string, message: string) => {
        set({ isLoading: true, error: null });
        try {
            const res = await axiosInstance.post('/sendMessages', { name, message });
            const data = res.data.success;
            return data;
        } catch (error) {
            set({ error: 'Failed to send message' });
        } finally {
            set({ isLoading: false });
        }
    },
}));