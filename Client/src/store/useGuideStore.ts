import { create } from 'zustand';
import axios from 'axios';
import { API_ROUTES, createApi } from '../lib/api';

export interface Guide {
    id: string;
    title: string;
    description: string;
    video: string;
    createdAt?: string;
}

interface GuideState {
    guides: Guide[];
    guide: Guide | null;
    isLoading: boolean;
    error: string | null;
    fetchGuides: (limit?: number) => Promise<void>;
    fetchGuideById: (id: string) => Promise<void>;
    addGuide: (guideData: FormData) => Promise<boolean>;
    editGuide: (id: string, guideData: FormData) => Promise<boolean>;
    deleteGuide: (id: string) => Promise<boolean>;
}

const axiosInstance = createApi(API_ROUTES.GUIDES);

export const useGuideStore = create<GuideState>((set) => ({
    guides: [],
    guide: null,
    isLoading: false,
    error: null,

    fetchGuides: async () => {
        set({ isLoading: true, error: null });
        try {
            const res = await axiosInstance.get('/');
            const data = res.data;
            set({ guides: data });
        } catch (error) {
            set({ error: 'Failed to fetch guides' });
        } finally {
            set({ isLoading: false });
        }
    },

    fetchGuideById: async (id) => {
        set({ isLoading: true, error: null });
        try {
            const res = await axiosInstance.get(`/${id}`);
            const data = res.data;
            set({ guide: data });
        } catch (error) {
            set({ error: 'Failed to fetch guide' });
        } finally {
            set({ isLoading: false });
        }
    },

    addGuide: async (formData: FormData) => {
        set({ isLoading: true, error: null });
        try {
            const res = await axiosInstance.post('/createGuide', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            const newGuide = res.data;
            set((state) => ({ guides: [newGuide, ...state.guides] }));
            return true;
        } catch (error) {
            set({ error: 'Failed to add guide' });
            return false;
        } finally {
            set({ isLoading: false });
        }
    },

    editGuide: async (id: string, formData: FormData) => {
        set({ isLoading: true, error: null });
        try {
            const res = await axiosInstance.put(`/updateGuide/${id}`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            const updatedGuide = res.data;
            set((state) => ({
                guides: state.guides.map((g) => (g.id === id ? updatedGuide : g)),
                guide: updatedGuide,
            }));
            return true;
        } catch (error) {
            set({ error: 'Failed to update guide' });
            return false;
        } finally {
            set({ isLoading: false });
        }
    },

    deleteGuide: async (id: string) => {
        set({ isLoading: true, error: null });
        try {
            await axiosInstance.delete(`/deleteGuide/${id}`);
            set((state) => ({
                guides: state.guides.filter((g) => g.id !== id),
            }));
            return true;
        } catch (error) {
            set({ error: 'Failed to delete guide' });
            return false;
        } finally {
            set({ isLoading: false });
        }
    },
}));
