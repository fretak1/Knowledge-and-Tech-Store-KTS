import { create } from 'zustand';
import axios from 'axios';
import { API_ROUTES, createApi } from '@/lib/api';


export interface Member {
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

interface MemberState {
    members: Member[];
    isLoading: boolean;
    error: string | null;
    fetchMembers: () => Promise<void>;
}

const axiosInstance = createApi(API_ROUTES.AUTH);

export const useMemberStore = create<MemberState>((set) => ({
    members: [],
    isLoading: false,
    error: null,

    fetchMembers: async () => {
        set({ isLoading: true, error: null });
        try {
            const res = await axiosInstance.get('/members');
            const data = res.data.user;
            set({ members: data });
        } catch (error) {
            set({ error: 'Failed to fetch members' });
        } finally {
            set({ isLoading: false });
        }
    },
}));
