"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import { ArrowLeft, BookText, Plus, X, Video, ListChecks, Hash } from "lucide-react";

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
import { useGuideStore } from "@/store/useGuideStore";

function AddOrEditGuideForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const guideId = searchParams.get("id");

    const { addGuide, editGuide, fetchGuideById, guide, isLoading } = useGuideStore();
    const isEditMode = Boolean(guideId);

    const [form, setForm] = useState({
        title: "",
        description: "",
        videoUrl: "", // For direct URL input
    });

    const [videoFile, setVideoFile] = useState<File | null>(null);

    useEffect(() => {
        if (isEditMode && guideId) {
            fetchGuideById(guideId);
        }
    }, [guideId, isEditMode, fetchGuideById]);

    useEffect(() => {
        if (isEditMode && guide && guide.id === guideId) {
            setForm({
                title: guide.title,
                description: guide.description,
                videoUrl: guide.video || "",
            });
        }
    }, [guide, isEditMode, guideId]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setVideoFile(e.target.files[0]);
        }
    };

    const handleSubmit = async () => {
        if (!form.title || !form.description) {
            toast.error("Title and description are required");
            return;
        }

        if (!videoFile && !form.videoUrl) {
            toast.error("Please provide a video URL or upload a video file");
            return;
        }

        const formData = new FormData();
        formData.append("title", form.title);
        formData.append("description", form.description);

        if (videoFile) {
            formData.append("video", videoFile);
        } else {
            formData.append("video", form.videoUrl);
        }

        const success = isEditMode && guideId
            ? await editGuide(guideId, formData)
            : await addGuide(formData);

        if (success) {
            toast.success(`Guide ${isEditMode ? "updated" : "created"} successfully`);
            router.push("/admin/guides");
        } else {
            toast.error("Something went wrong. Please try again.");
        }
    };

    return (
        <div className="min-h-screen bg-[#F8FAFC] pb-20">
            <div className="max-w-5xl mx-auto px-4 pt-10">
                <Button
                    variant="ghost"
                    onClick={() => router.push("/admin/guides")}
                    className="mb-8 hover:bg-white text-gray-500 font-medium group"
                >
                    <ArrowLeft className="mr-2 h-4 w-4 group-hover:-translate-x-1 transition-transform" /> Back to Guides
                </Button>

                <div className="bg-white rounded-[2.5rem] shadow-[0_40px_80px_-20px_rgba(0,0,0,0.08)] border border-gray-100 overflow-hidden">
                    <div className="p-8 md:p-14">
                        <header className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
                            <div>
                                <div className="h-12 w-12 bg-indigo-50 rounded-2xl flex items-center justify-center mb-4 text-indigo-600">
                                    <BookText className="h-6 w-6" />
                                </div>
                                <h1 className="text-4xl font-black text-gray-900 tracking-tight">
                                    {isEditMode ? "Update Guide" : "Draft New Guide"}
                                </h1>
                                <p className="text-gray-400 mt-2 font-medium">Create clear instructional videos for the community.</p>
                            </div>
                        </header>

                        <div className="grid grid-cols-1 md:grid-cols-6 gap-x-12 gap-y-10">
                            {/* Title */}
                            <div className="md:col-span-6 space-y-3">
                                <Label className="text-[10px] font-black uppercase tracking-widest text-indigo-500 ml-1">Guide Title</Label>
                                <Input
                                    name="title"
                                    value={form.title}
                                    onChange={handleChange}
                                    placeholder="e.g., How to Fix Slow WiFi"
                                    className="rounded-2xl border-gray-100 bg-gray-50/50 h-16 px-6 focus:ring-2 focus:ring-indigo-500/20 text-xl font-bold transition-all outline-none"
                                />
                            </div>

                            {/* Description */}
                            <div className="md:col-span-6 space-y-3">
                                <Label className="text-[10px] font-black uppercase tracking-widest text-indigo-500 ml-1">Brief Description</Label>
                                <Textarea
                                    name="description"
                                    value={form.description}
                                    onChange={handleChange}
                                    placeholder="Provide a short overview of what this guide covers..."
                                    className="rounded-2xl border-gray-100 bg-gray-50/50 min-h-[120px] p-6 focus:ring-2 focus:ring-indigo-500/20 text-lg leading-relaxed outline-none resize-none transition-all"
                                />
                            </div>

                            {/* Video */}
                            <div className="md:col-span-6 space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    {/* Video URL */}
                                    <div className="space-y-3">
                                        <Label className="text-[10px] font-black uppercase tracking-widest text-indigo-500 ml-1 flex items-center gap-1.5">
                                            <Video className="h-3 w-3" /> Video Tutorial URL
                                        </Label>
                                        <Input
                                            name="videoUrl"
                                            value={form.videoUrl}
                                            onChange={handleChange}
                                            disabled={!!videoFile}
                                            placeholder="https://youtube.com/watch?v=..."
                                            className="rounded-2xl border-gray-100 bg-gray-50/50 h-16 px-6 focus:ring-2 focus:ring-indigo-500/20 font-medium transition-all outline-none disabled:opacity-50"
                                        />
                                    </div>

                                    {/* Video Upload */}
                                    <div className="space-y-3">
                                        <Label className="text-[10px] font-black uppercase tracking-widest text-indigo-500 ml-1 flex items-center gap-1.5">
                                            <Plus className="h-3 w-3" /> Upload Video File
                                        </Label>
                                        <div className="relative">
                                            <Input
                                                type="file"
                                                accept="video/*"
                                                onChange={handleFileChange}
                                                className="hidden"
                                                id="video-upload"
                                            />
                                            <label
                                                htmlFor="video-upload"
                                                className="flex items-center justify-center w-full h-16 rounded-2xl border-2 border-dashed border-gray-200 bg-gray-50/50 cursor-pointer hover:border-indigo-400 hover:bg-indigo-50/30 transition-all font-medium text-gray-500 px-6"
                                            >
                                                {videoFile ? videoFile.name : "Select or Drop Video File"}
                                            </label>
                                            {videoFile && (
                                                <button
                                                    onClick={() => setVideoFile(null)}
                                                    className="absolute top-1/2 -right-10 -translate-y-1/2 p-2 text-gray-400 hover:text-red-500"
                                                >
                                                    <X className="h-5 w-5" />
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                <p className="text-[10px] text-gray-400 font-medium text-center">
                                    Choose either to provide a link or upload a video directly. Upload takes precedence.
                                </p>
                            </div>

                            {/* Submit */}
                            <div className="md:col-span-6 pt-10 border-t border-gray-50">
                                <Button
                                    onClick={handleSubmit}
                                    disabled={isLoading}
                                    className="w-full h-20 bg-indigo-600 hover:bg-indigo-700 text-white text-xl font-black rounded-3xl shadow-2xl shadow-indigo-100 transition-all hover:-translate-y-1 active:scale-[0.98] disabled:bg-gray-200 disabled:shadow-none"
                                >
                                    {isLoading ? (
                                        <div className="flex items-center gap-3">
                                            <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                            Uploading & Saving...
                                        </div>
                                    ) : (
                                        isEditMode ? "Update Guide" : "Launch Guide"
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

export default function AddOrEditGuidePage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center">
                <div className="h-12 w-12 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin"></div>
            </div>
        }>
            <AddOrEditGuideForm />
        </Suspense>
    );
}
