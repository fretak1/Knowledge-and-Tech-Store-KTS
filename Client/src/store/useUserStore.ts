import { create } from 'zustand';
import axios from 'axios';
import { API_ROUTES, createApi } from '@/lib/api';
import { formatError } from '@/lib/utils';

export interface Student {
    id: string;
    name: string;
    email?: string;
    department?: string;
    batch?: string;
    phone?: string;
    profileImage?: string;
    createdAt?: string;
}

export interface Member {
    id: string;
    name: string;
    email?: string;
    department?: string;
    batch?: string;
    phone?: string;
    profileImage?: string;
}

export interface User {
    id: string;
    name: string | null;
    email: string;
    department: string | null;
    batch?: string | null;
    profileImage: string | null;
    github?: string | null;
    linkedin?: string | null;
    telegram?: string | null;
    role?: string;
    createdAt?: string;
}

interface UserStore {
    students: Student[];
    isLoading: boolean;
    error: string | null;
    members: Member[];
    users: User[];
    createStudent: (data: {
        name?: string;
        email: string;
        phone?: string;
        department?: string;
        batch?: string;
    }) => Promise<boolean>;


    getMembers: () => Promise<void>;
    getStudents: () => Promise<void>;
    searchStudents: (query: string, field: "name" | "department" | "batch") => Promise<void>;
    getAllUsers: () => Promise<void>;
    createMember: (memberData: FormData) => Promise<boolean>;
    deleteMember: (id: string) => Promise<boolean>;
    updateProfile: (formData: FormData) => Promise<any>;
}

const axiosInstance = createApi(API_ROUTES.USER);

export const useUserStore = create<UserStore>((set) => ({
    students: [],
    isLoading: false,
    error: null,
    members: [],
    users: [],
    /* =========================
       CREATE STUDENT (ADMIN)
    ========================= */
    createStudent: async (data) => {
        set({ isLoading: true, error: null });

        try {
            const res = await axiosInstance.post('/registerStudent', data);
            set({ isLoading: false });
            return res.data.success;
        } catch (err: any) {
            const message = formatError(err.response?.data?.error) || 'Failed to create student';
            set({ isLoading: false, error: message });
            return false;
        }
    },

    /* =========================
       SEARCH STUDENTS (MEMBER)
    ========================= */
    searchStudents: async (query: string, field: "name" | "department" | "batch") => {
        if (!query || query.length < 2) {
            set({ students: [] });
            return;
        }

        set({ isLoading: true, error: null });

        try {
            const params = new URLSearchParams();
            params.append("q", query);
            if (field) params.append("field", field);

            const res = await axiosInstance.get(`/students/search?${params.toString()}`);

            set({ students: res.data, isLoading: false });
        } catch (err) {
            set({
                isLoading: false,
                error: "Failed to search students",
            });
        }
    },

   
    getMembers: async () => {
        set({ isLoading: true, error: null });
        try {
            const res = await axiosInstance.get('/getMembers');
            set({ members: res.data, isLoading: false });
        } catch (err) {
            set({
                isLoading: false,
                error: 'Failed to get members',
            });
        }
    },

    getAllUsers: async () => {
        set({ isLoading: true, error: null });
        try {
            const res = await axiosInstance.get('/getAllUsers');
            set({ users: res.data, isLoading: false });
        } catch (err) {
            set({
                isLoading: false,
                error: 'Failed to get users',
            });
        }
    },


    createMember: async (memberData) => {
        set({ isLoading: true, error: null });

        try {
            const response = await axiosInstance.post(
                '/registerMember',
                memberData,
                {
                    headers: { "Content-Type": "multipart/form-data" },
                }
            );
            set({ isLoading: false });
            return response.data.success;
        } catch (err: any) {
            const message = formatError(err.response?.data?.error) || 'Failed to create member';
            set({ isLoading: false, error: message });
            return false;
        }
    },

 

    deleteMember: async (id) => {
        set({ isLoading: true, error: null });

        try {
            const res = await axiosInstance.delete(`/deleteMember/${id}`);
            set({ isLoading: false });
            return res.data.success;
        } catch (err: any) {
            const message = formatError(err.response?.data?.error) || 'Failed to delete member';
            set({ isLoading: false, error: message });
            return false;
        }
    },

    /* =========================
       GET STUDENTS (MEMBER)
    ========================= */
    getStudents: async () => {
        set({ isLoading: true, error: null });
        try {
            const res = await axiosInstance.get('/getStudents');
            set({ students: res.data, isLoading: false });
        } catch (err) {
            set({
                isLoading: false,
                error: 'Failed to get students',
            });
        }
    },

    updateProfile: async (formData) => {
        set({ isLoading: true, error: null });
        try {
            const response = await axiosInstance.put("/profile", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            set({ isLoading: false });
            return response.data;
        } catch (error: any) {
            const message = formatError(error.response?.data?.error) || "Failed to update profile";
            set({ isLoading: false, error: message });
            return null;
        }
    },

}));
