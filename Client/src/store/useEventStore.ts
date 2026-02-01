import { create } from "zustand";
import axios from "axios";
import { API_ROUTES, createApi } from "@/lib/api";

export interface Event {
    id: string;
    title: string;
    description: string;
    date: string;
    location: string;
    type: string;
    imageUrl?: string | null;
    published?: boolean;
}

interface EventState {
    events: Event[];
    event: Event | null;
    isLoading: boolean;
    error: string | null;

    fetchEvents: () => Promise<void>;
    getEventById: (id: string) => Promise<Event | null>;

    createEvent: (data: FormData) => Promise<boolean>;
    updateEvent: (id: string, data: FormData) => Promise<boolean>;
    deleteEvent: (id: string) => Promise<boolean>;
}

const axiosInstance = createApi(API_ROUTES.EVENTS); // e.g. http://localhost:4000/api/events

export const useEventStore = create<EventState>((set, get) => ({
    events: [],
    event: null,
    isLoading: false,
    error: null,

    /* ---------------- FETCH ALL EVENTS ---------------- */
    fetchEvents: async () => {
        set({ isLoading: true, error: null });
        try {
            const res = await axiosInstance.get("/");
            set({ events: res.data });
        } catch (error) {
            set({ error: "Failed to fetch events" });
        } finally {
            set({ isLoading: false });
        }
    },

  

    /* ---------------- FETCH EVENT (RETURN VALUE) ---------------- */
    getEventById: async (id) => {
        try {
            const res = await axiosInstance.get(`/${id}`);
            return res.data;
        } catch (error) {
            console.error(error);
            return null;
        }
    },

    /* ---------------- CREATE EVENT ---------------- */
    createEvent: async (data) => {
        set({ isLoading: true, error: null });
      
        try {
            await axiosInstance.post("/createEvent", data);
            await get().fetchEvents();
            return true;
        } catch (error) {
            set({ error: "Failed to create event" });
            return false;
        } finally {
            set({ isLoading: false });
        }
    },

    /* ---------------- UPDATE EVENT ---------------- */
    updateEvent: async (id, data) => {
        set({ isLoading: true, error: null });
        try {
         

            const res = await axiosInstance.put(`/updateEvent/${id}`, data, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            return true;
        } catch (error) {
            set({ error: "Failed to update event" });
            return false;
        } finally {
            set({ isLoading: false });
        }
    },

    /* ---------------- DELETE EVENT ---------------- */
    deleteEvent: async (id) => {
        set({ isLoading: true, error: null });
        try {
            await axiosInstance.delete(`/deleteEvent/${id}`);
            set({
                events: get().events.filter((event) => event.id !== id),
            });
            return true;
        } catch (error) {
            set({ error: "Failed to delete event" });
            return false;
        } finally {
            set({ isLoading: false });
        }
    },
}));
