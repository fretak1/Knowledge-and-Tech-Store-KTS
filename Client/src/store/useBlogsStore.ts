import { create } from "zustand";
import axios from "axios";
import { API_ROUTES, createApi } from "@/lib/api";

export interface Blog {
    id: string;
    title: string;
    content: string;
    imageUrls: string[];
    category: string;
    createdAt: string;
    updatedAt: string;
}

interface BlogState {
    blogs: Blog[];
    blog: Blog | null;
    isLoading: boolean;
    error: string | null;

    fetchBlogs: () => Promise<void>;
    getBlogById: (id: string) => Promise<Blog | null>;

    addBlog: (data: FormData) => Promise<boolean>;
    editBlog: (id: string, data: FormData) => Promise<boolean>;
    deleteBlog: (id: string) => Promise<boolean>;
}

const axiosInstance = createApi(API_ROUTES.BLOGS);

export const useBlogsStore = create<BlogState>((set, get) => ({
    blogs: [],
    blog: null,
    isLoading: false,
    error: null,

    /* ---------------- FETCH ALL BLOGS ---------------- */
    fetchBlogs: async () => {
        set({ isLoading: true, error: null });
        try {
            const res = await axiosInstance.get("/");
            set({ blogs: res.data });
        } catch (error) {
            console.error(error);
            set({ error: "Failed to fetch blogs" });
        } finally {
            set({ isLoading: false });
        }
    },

    
    /* ---------------- FETCH BLOG (RETURN VALUE) ---------------- */
    getBlogById: async (id) => {
        try {
            const res = await axiosInstance.get(`/${id}`);
            return res.data;
        } catch (error) {
            console.error(error);
            return null;
        }
    },

    /* ---------------- ADD BLOG ---------------- */
    addBlog: async (data) => {
        set({ isLoading: true, error: null });
        try {
            await axiosInstance.post("/createBlog", data, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            await get().fetchBlogs();
            return true;
        } catch (error) {
            set({ error: "Failed to add blog" });
            return false;
        } finally {
            set({ isLoading: false });
        }
    },

    /* ---------------- EDIT BLOG ---------------- */
    editBlog: async (id, data) => {
        set({ isLoading: true, error: null });
        try {
            await axiosInstance.put(`/updateBlog/${id}`, data, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            await get().fetchBlogs();
            return true;
        } catch (error) {
            set({ error: "Failed to edit blog" });
            return false;
        } finally {
            set({ isLoading: false });
        }
    },

    /* ---------------- DELETE BLOG ---------------- */
    deleteBlog: async (id) => {
        set({ isLoading: true, error: null });
        try {
            await axiosInstance.delete(`/deleteBlog/${id}`);
            set({
                blogs: get().blogs.filter((blog) => blog.id !== id),
            });
            return true;
        } catch (error) {
            set({ error: "Failed to delete blog" });
            return false;
        } finally {
            set({ isLoading: false });
        }
    },
}));
