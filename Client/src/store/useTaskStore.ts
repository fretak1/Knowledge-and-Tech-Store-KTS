import { create } from 'zustand';
import axios from 'axios';
import { API_ROUTES, createApi } from '@/lib/api';




export type TaskStatus = 'PENDING' | 'IN_PROGRESS' | 'COMPLETED';


export interface Task {
    id: string;
    title: string;
    description: string;
    device: string;
    manufacturer: string;
    serialNumber: string;
    status: TaskStatus;
    createdAt: string;

    // For MEMBER view
    student?: {
        name: string | null;
        department: string;
        batch: string;
    } | null;

    // For STUDENT view
    member?: {
        name: string | null;
    } | null;
}


interface TaskState {
    tasks: Task[];
    isLoading: boolean;
    error: string | null;
    getTasks: () => Promise<void>;
    createTask: (data: {
        title?: string;
        description?: string;
        device?: string;
        manufacturer?: string;
        serialNumber?: string;
        studentId?: string;
    }) => Promise<boolean>;
    updateTaskStatus: (id: string, status: TaskStatus) => Promise<boolean>;
}

const axiosInstance = createApi(API_ROUTES.TASKS);

export const useTaskStore = create<TaskState>((set) => ({
    tasks: [],
    isLoading: false,
    error: null,

    getTasks: async () => {
        set({ isLoading: true, error: null });
        try {

            const res = await axiosInstance.get('/getTasks');
            const data = await res.data;
            set({ tasks: data });

        } catch (error) {
            set({ error: 'Failed to fetch tasks' });
        } finally {
            set({ isLoading: false });
        }
    },


    createTask: async (data) => {
        set({ isLoading: true, error: null });
        try {
            const res = await axiosInstance.post('/createTask', data);
            return res.data.success;
        } catch (error) {
            set({ error: 'Failed to create task' });
            return false;
        } finally {
            set({ isLoading: false });
        }
    },


    updateTaskStatus: async (id: string, status: TaskStatus) => {
        set({ isLoading: true, error: null });
        try {
            const res = await axiosInstance.patch(`/${id}/status`, { status });

            set((state) => ({
                tasks: state.tasks.map((task) =>
                    task.id === id ? { ...task, status } : task
                ),
            }));
            return res.data.success;
        } catch (error) {
            set({ error: 'Failed to fetch tasks' });
            return false;
        } finally {
            set({ isLoading: false });
        }
    },
}));
