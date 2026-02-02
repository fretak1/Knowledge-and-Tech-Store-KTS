"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Image from "next/image";
import { toast } from "sonner";
import { ArrowLeft, BookOpen, Upload, X, Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useBlogsStore } from "@/store/useBlogsStore";



export default function AddOrEditBlogPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const blogId = searchParams.get("id");

    

    const { addBlog, editBlog, getBlogById, isLoading } = useBlogsStore();
    const isEditMode = Boolean(blogId);

    const [form, setForm] = useState({
        title: "",
        content: "",
        category: "technology",
    });

    const [existingImages, setExistingImages] = useState<string[]>([]);
    const [newImageFiles, setNewImageFiles] = useState<File[]>([]);
    const [previewUrls, setPreviewUrls] = useState<string[]>([]);

    useEffect(() => {
        if (isEditMode && blogId) {
            getBlogById(blogId).then((blog) => {
                if (!blog) {
                    toast.error("Blog post not found");
                    router.push("/admin/blogs");
                    return;
                }
                setForm({
                    title: blog.title,
                    content: blog.content,
                    category: blog.category,
                });
                setExistingImages(blog.imageUrls || []);
            });
        }
    }, [blogId, isEditMode, getBlogById, router]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const files = Array.from(e.target.files);
            const currentTotal = existingImages.length + newImageFiles.length;
            const remainingSlots = 5 - currentTotal;

            if (remainingSlots <= 0) {
                toast.warning("You have reached the limit of 5 images.");
                return;
            }

            let filesToAdd = files;
            if (files.length > remainingSlots) {
                toast.warning(`You can only add ${remainingSlots} more image(s).`);
                filesToAdd = files.slice(0, remainingSlots);
            }

            setNewImageFiles(prev => [...prev, ...filesToAdd]);

            const newPreviews = filesToAdd.map(file => URL.createObjectURL(file));
            setPreviewUrls(prev => [...prev, ...newPreviews]);
        }
    };

    const removeNewImage = (index: number) => {
        setNewImageFiles(prev => prev.filter((_, i) => i !== index));
        setPreviewUrls(prev => {
            URL.revokeObjectURL(prev[index]);
            return prev.filter((_, i) => i !== index);
        });
    };

    const removeExistingImage = (index: number) => {
        setExistingImages(prev => prev.filter((_, i) => i !== index));
    };

    const handleSubmit = async () => {
        if (!form.title || !form.content) {
            toast.error("Title and content are required");
            return;
        }

        const formData = new FormData();
        formData.append("title", form.title);
        formData.append("content", form.content);
        formData.append("category", form.category);

        // Append existing images that were kept
        existingImages.forEach(url => {
            formData.append("existingImages", url);
        });

        // Append new image files
        newImageFiles.forEach(file => {
            formData.append("images", file);
        });

        const success = isEditMode && blogId
            ? await editBlog(blogId, formData)
            : await addBlog(formData);

        if (success) {
            toast.success(`Blog post ${isEditMode ? "updated" : "created"} successfully`);
            router.push("/admin/blogs");
        } else {
            toast.error("Something went wrong. Please try again.");
        }
    };

    return (
        <div className="min-h-screen bg-[#F8FAFC] pb-20">
            <div className="max-w-5xl mx-auto px-4 pt-10">
                <Button
                    variant="ghost"
                    onClick={() => router.push("/admin/blogs")}
                    className="mb-8 hover:bg-white text-gray-500 font-medium"
                >
                    <ArrowLeft className="mr-2 h-4 w-4" /> Back to Blogs
                </Button>

                <div className="bg-white rounded-[2.5rem] shadow-[0_40px_80px_-20px_rgba(0,0,0,0.08)] border border-gray-100 overflow-hidden">
                    <div className="p-8 md:p-14">
                        <header className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
                            <div>
                                <div className="h-12 w-12 bg-indigo-50 rounded-2xl flex items-center justify-center mb-4">
                                    <BookOpen className="h-6 w-6 text-indigo-600" />
                                </div>
                                <h1 className="text-4xl font-black text-gray-900 tracking-tight">
                                    {isEditMode ? "Edit Blog Post" : "Publish New Blog"}
                                </h1>
                                <p className="text-gray-400 mt-2 font-medium">Share  insights and updates with the community.</p>
                            </div>

                        </header>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">
                            {/* Title */}
                            <div className="md:col-span-2 space-y-3">
                                <Label className="text-[10px] font-black uppercase tracking-widest text-indigo-500 ml-1">Article Title *</Label>
                                <Input
                                    name="title"
                                    value={form.title}
                                    onChange={handleChange}
                                    placeholder="Enter a compelling title..."
                                    className="rounded-2xl border-gray-100 bg-gray-50/50 h-16 px-6 focus:ring-2 focus:ring-indigo-500/20 text-xl font-bold transition-all outline-none"
                                />
                            </div>

                            {/* Category */}
                            <div className="space-y-3">
                                <Label className="text-[10px] font-black uppercase tracking-widest text-indigo-500 ml-1">Category</Label>
                                <Select
                                    value={form.category}
                                    onValueChange={(val) => setForm({ ...form, category: val })}
                                >
                                    <SelectTrigger className="rounded-2xl border-gray-100 bg-gray-50/50 h-16 px-6 focus:ring-2 focus:ring-indigo-500/20 transition-all outline-none">
                                        <SelectValue placeholder="Select a category" />
                                    </SelectTrigger>
                                    <SelectContent className="rounded-2xl border-gray-100 shadow-xl">
                                        <SelectItem value="technology">Technology</SelectItem>
                                        <SelectItem value="education">Education</SelectItem>
                                        <SelectItem value="expo">Expo</SelectItem>
                                        <SelectItem value="announcement">Announcement</SelectItem>
                                        <SelectItem value="guide">Guide</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* Images Section */}
                            <div className="md:col-span-2 space-y-4">
                                <Label className="text-[10px] font-black uppercase tracking-widest text-indigo-500 ml-1">Visual Media (Up to 5 images)</Label>

                                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
                                    {/* Existing Images */}
                                    {existingImages.map((url, idx) => (
                                        <div key={`existing-${idx}`} className="relative aspect-square rounded-2xl overflow-hidden group border-2 border-transparent hover:border-indigo-500 transition-all shadow-sm">
                                            <Image src={url} alt="Blog image" fill className="object-cover" />
                                            <button
                                                onClick={() => removeExistingImage(idx)}
                                                className="absolute top-2 right-2 bg-red-500 text-white p-1.5 rounded-xl opacity-0 group-hover:opacity-100 transition-all shadow-lg hover:scale-110"
                                            >
                                                <X className="h-3 w-3" />
                                            </button>
                                            <div className="absolute inset-x-0 bottom-0 bg-black/40 text-[8px] text-white py-1 px-1 text-center font-bold uppercase tracking-tighter">Current</div>
                                        </div>
                                    ))}

                                    {/* New Previews */}
                                    {previewUrls.map((url, idx) => (
                                        <div key={`new-${idx}`} className="relative aspect-square rounded-2xl overflow-hidden group border-2 border-transparent hover:border-indigo-500 transition-all shadow-sm">
                                            <Image src={url} alt="New image preview" fill className="object-cover" />
                                            <button
                                                onClick={() => removeNewImage(idx)}
                                                className="absolute top-2 right-2 bg-red-500 text-white p-1.5 rounded-xl opacity-0 group-hover:opacity-100 transition-all shadow-lg hover:scale-110"
                                            >
                                                <X className="h-3 w-3" />
                                            </button>
                                            <div className="absolute inset-x-0 bottom-0 bg-indigo-600/60 text-[8px] text-white py-1 px-1 text-center font-bold uppercase tracking-tighter">New</div>
                                        </div>
                                    ))}

                                    {/* Upload Trigger */}
                                    {(existingImages.length + newImageFiles.length) < 5 && (
                                        <label className="relative aspect-square rounded-2xl border-2 border-dashed border-gray-200 bg-gray-50/50 flex flex-col items-center justify-center cursor-pointer hover:bg-indigo-50/30 hover:border-indigo-200 transition-all group shadow-sm">
                                            <Input
                                                type="file"
                                                multiple
                                                className="hidden"
                                                onChange={handleFileChange}
                                                accept="image/*"
                                            />
                                            <div className="h-10 w-10 bg-white rounded-xl shadow-sm flex items-center justify-center group-hover:scale-110 transition-transform">
                                                <Plus className="h-5 w-5 text-indigo-500" />
                                            </div>
                                            <span className="mt-2 text-[10px] font-black text-gray-400 uppercase tracking-tighter">Add Photo</span>
                                        </label>
                                    )}
                                </div>
                            </div>

                            {/* Content */}
                            <div className="md:col-span-2 space-y-3">
                                <Label className="text-[10px] font-black uppercase tracking-widest text-indigo-500 ml-1">Article Content *</Label>
                                <Textarea
                                    name="content"
                                    value={form.content}
                                    onChange={handleChange}
                                    placeholder="Write your story here... Use clear, engaging language."
                                    className="rounded-[2rem] border-gray-100 bg-gray-50/50 min-h-[300px] p-8 focus:ring-2 focus:ring-indigo-500/20 text-lg leading-relaxed outline-none resize-none transition-all"
                                />
                            </div>

                            {/* Submit */}
                            <div className="md:col-span-2 pt-10 border-t border-gray-50">
                                <Button
                                    onClick={handleSubmit}
                                    disabled={isLoading}
                                    className="w-full h-20 bg-indigo-600 hover:bg-indigo-700 text-white text-xl font-black rounded-3xl shadow-2xl shadow-indigo-200 transition-all hover:-translate-y-1 active:scale-[0.98] disabled:bg-gray-200 disabled:shadow-none"
                                >
                                    {isLoading ? (
                                        <div className="flex items-center gap-3">
                                            <div className="h-5 w-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                                            Processing...
                                        </div>
                                    ) : (
                                        isEditMode ? "Update Publication" : "Publish Article"
                                    )}
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
