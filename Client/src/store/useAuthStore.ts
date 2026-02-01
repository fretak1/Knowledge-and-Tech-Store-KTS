import { create } from 'zustand';
import axios from 'axios';
import { API_ROUTES, createApi } from '@/lib/api';
import { persist } from "zustand/middleware";
import { formatError } from '@/lib/utils';


interface User {
    id: string;
    name: string | null;
    email: string;
    role: string;
    profileImage: string | null;
    phone: string | null;
    department?: string | null;
    batch?: string | null;
    github?: string | null;
    linkedin?: string | null;
    telegram?: string | null;
}

interface AuthState {
    user: User | null;
    isLoading: boolean;
    login: (email: string, password: string) => Promise<boolean>;
    logout: () => Promise<void>;
    register: (
        name: string,
        email: string,
        password: string
    ) => Promise<string | null>;
    updateProfile: (formData: FormData) => Promise<boolean>;
    checkAuth: () => Promise<void>;
    sendResetCode: (email: string) => Promise<boolean>;
    verifyResetCode: (email: string, code: string) => Promise<boolean>;
    resetPassword: (email: string, code: string, password: string) => Promise<boolean>;
    error: string | null;
}

const axiosInstance = createApi(API_ROUTES.AUTH);
const userAxiosInstance = createApi(API_ROUTES.USER);

export const useAuthStore = create<AuthState>()(
    persist((set, get) => ({
        user: null,
        isLoading: false,
        error: null,
        login: async (email, password) => {
            set({ isLoading: true, error: null });
            try {
                const response = await axiosInstance.post("/login", {
                    email,
                    password,
                });
                set({ isLoading: false, user: response.data.user });
                return true;
            } catch (error: any) {
                const message = formatError(error.response?.data?.error) || "Login failed";
                set({
                    isLoading: false,
                    error: message,
                });
                return false;
            }
        },

        logout: async () => {
            try {
                await axiosInstance.post('/logout');
            } catch (error) {
                console.error('Logout error:', error);
            }
            set({ user: null });
        },

        register: async (name, email, password) => {
            set({ isLoading: true, error: null });
            try {
                const response = await axiosInstance.post("/register", {
                    name,
                    email,
                    password,
                });
                set({ isLoading: false });
                return response.data.userId;
            } catch (error: any) {
                const message = formatError(error.response?.data?.error) || "Registration failed";
                set({
                    isLoading: false,
                    error: message,
                });
                return null;
            }
        },

        updateProfile: async (formData: FormData) => {
            set({ isLoading: true, error: null });
            try {
                const response = await userAxiosInstance.put('/profile', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                });

                // Update local user state with returned data
                if (response.data.user) {
                    set({ user: response.data.user });
                }
                set({ isLoading: false });
                return true;
            } catch (error: any) {
                const message = formatError(error.response?.data?.error) || "Failed to update profile";
                set({
                    isLoading: false,
                    error: message
                });
                return false;
            }
        },

        checkAuth: async () => {
            set({ isLoading: true });
            try {
                const response = await axiosInstance.get("/me");
                set({ user: response.data.user, isLoading: false });
            } catch (error) {
                set({ user: null, isLoading: false });
            }
        },


        sendResetCode: async (email: string) => {
            set({ isLoading: true, error: null });
            try {
                const response = await axiosInstance.post("/forgot-password", { email });
                set({ isLoading: false });
                return true;
            } catch (error: any) {
                const message = formatError(error.response?.data?.error) || "Failed to send reset code";
                set({ isLoading: false, error: message });
                return false;
            }
        },

        verifyResetCode: async (email: string, code: string) => {
            set({ isLoading: true, error: null });
            try {
                const response = await axiosInstance.post("/verify-reset-code", { email, code });
                set({ isLoading: false });
                return true;
            } catch (error: any) {
                const message = formatError(error.response?.data?.error) || "Invalid or expired code";
                set({ isLoading: false, error: message });
                return false;
            }
        },

        resetPassword: async (email: string, code: string, password: string) => {
            set({ isLoading: true, error: null });
            try {
                const response = await axiosInstance.post("/reset-password", { email, code, password });
                set({ isLoading: false });
                return true;
            } catch (error: any) {
                const message = formatError(error.response?.data?.error) || "Failed to reset password";
                set({ isLoading: false, error: message });
                return false;
            }
        },

    }),
        {
            name: "auth-storage",
            partialize: (state) => ({ user: state.user }),
        }
    ));
