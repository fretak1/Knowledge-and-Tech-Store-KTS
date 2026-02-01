import { create } from 'zustand';
import axios from 'axios';
import { API_ROUTES, createApi } from '@/lib/api';
import { formatError } from '@/lib/utils';

export interface User {
    id: string;
    name: string | null;
    email: string;
    profileImage: string | null;
}

export interface Shift {
    id: string;
    date: string;
    startTime: string;
    endTime: string;
    userId: string | null;
    status: string;
    user?: User | null;
    isRecurring?: boolean;
}
export interface RecurringShift {
    id: string;
    dayOfWeek: number;
    startTime: string;
    endTime: string;
    userId: string;
    user?: User;
}

interface ShiftStore {
    shifts: Shift[];
    recurringShifts: RecurringShift[];
    isLoading: boolean;
    error: string | null;

    fetchShifts: (start?: string, end?: string) => Promise<void>;
    fetchRecurringShifts: () => Promise<void>;
    createRecurringShift: (data: { dayOfWeek: number; startTime: string; endTime: string; userId: string }) => Promise<boolean>;
    updateShift: (id: string, data: Partial<Shift>) => Promise<boolean>;
    deleteRecurringShift: (id: string) => Promise<boolean>;
}

const axiosInstance = createApi(API_ROUTES.SHIFTS);

export const useShiftStore = create<ShiftStore>((set, get) => ({
    shifts: [],
    recurringShifts: [],
    isLoading: false,
    error: null,

    fetchShifts: async (start, end) => {
        set({ isLoading: true, error: null });
        try {
            const params = new URLSearchParams();
            if (start) params.append('start', start);
            if (end) params.append('end', end);

            const response = await axiosInstance.get(`/?${params.toString()}`);
            set({ shifts: response.data, isLoading: false });
        } catch (error) {
            set({ isLoading: false, error: 'Failed to fetch shifts' });
            console.error(error);
        }
    },

    fetchRecurringShifts: async () => {
        set({ isLoading: true, error: null });
        try {
            const response = await axiosInstance.get('/recurring');
            set({ recurringShifts: response.data, isLoading: false });
        } catch (error) {
            set({ isLoading: false, error: 'Failed to fetch recurring shifts' });
            console.error(error);
        }
    },

  
    createRecurringShift: async (data) => {
        set({ isLoading: true });
        try {
            const response = await axiosInstance.post("/recurring", data);
            const newShift = response.data;
            set((state) => ({
                recurringShifts: [...state.recurringShifts, newShift],
                isLoading: false
            }));
            return true;
        } catch (error: any) {
            set({ isLoading: false });
            const message = formatError(error.response?.data?.error) || "Failed to create recurring shift";
            return false;
        }
    },

    updateShift: async (id, data) => {
        set({ isLoading: true });
        try {
            const response = await axiosInstance.patch(`/${id}`, data);
            set((state) => ({
                shifts: state.shifts.map((s) => (s.id === id ? response.data : s)),
                isLoading: false
            }));
            return true;
        } catch (error: any) {
            set({ isLoading: false });
            const message = formatError(error.response?.data?.error) || "Failed to update shift";
            return false;
        }
    },


    deleteRecurringShift: async (id) => {
        set({ isLoading: true });
        try {
            await axiosInstance.delete(`/recurring/${id}`);
            set((state) => ({
                recurringShifts: state.recurringShifts.filter(s => s.id !== id),
                isLoading: false
            }));
            return true;
        } catch (error: any) {
            set({ isLoading: false });
            return false;
        }
    },

   
}));
