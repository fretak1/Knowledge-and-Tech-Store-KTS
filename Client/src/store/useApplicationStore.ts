import { create } from "zustand";
import axios from "axios";
import { API_ROUTES, createApi } from "@/lib/api";
import { formatError } from "@/lib/utils";

interface Application {
    id: string;
    name: string;
    email: string;
    phone: string;
    department: string;
    batch: string;
    reason: string;
    status: string;
    createdAt: string;
    user?: {
        profileImage?: string;
    }
}

interface ApplicationState {
    applications: Application[];
    isOpen: boolean;
    isLoading: boolean;
    error: string | null;
    fetch: () => Promise<void>;
    toggle: (isOpen: boolean) => Promise<boolean>;
    submitApplication: (data: any) => Promise<boolean>;
    fetchApplications: () => Promise<void>;
}

const axiosInstance = createApi(API_ROUTES.APPLICATIONS);

export const useApplicationStore = create<ApplicationState>((set, get) => ({
    applications: [],
    isOpen: false,
    isLoading: false,
    error: null,

    fetch: async () => {
        try {
            const res = await axiosInstance.get('/');
            set({ isOpen: res.data.isOpen });
        } catch (error) {
            console.error(error);
        }
    },

    toggle: async (isOpen: boolean) => {
        set({ isLoading: true });
        try {
            await axiosInstance.post('/', { isOpen });
            set({ isOpen });
            return true;
        } catch (error: any) {
            const message = formatError(error.response?.data?.error) || "Failed to update config";
            set({ error: message });
            return false;
        } finally {
            set({ isLoading: false });
        }
    },

    submitApplication: async (data: any) => {
        set({ isLoading: true });
        try {
            await axiosInstance.post('/apply', data);
            return true;
        } catch (error: any) {
            const message = formatError(error.response?.data?.error) || "Failed to submit application";
            set({ error: message });
            return false;
        } finally {
            set({ isLoading: false });
        }
    },

    fetchApplications: async () => {
        set({ isLoading: true });
        try {
            const res = await axiosInstance.get('/all');
            set({ applications: res.data });
        } catch (error: any) {
            const message = formatError(error.response?.data?.error) || "Failed to fetch applications";
            set({ error: message });
        } finally {
            set({ isLoading: false });
        }
    },


}));
