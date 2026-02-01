"use client";

import { useEffect, useState } from "react";
import { useBlogsStore } from "@/store/useBlogsStore";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
    Dialog,
    DialogContent,
    DialogTrigger,
} from "@/components/ui/dialog";
import Link from "next/link";
import { Calendar, ChevronRight, BookOpen, X, Maximize2 } from "lucide-react";

interface BlogGalleryProps {
    imageUrls: string[];
    title: string;
    category: string;
    onImageClick: (url: string) => void;
}

function BlogGallery({ imageUrls, title, category, onImageClick }: BlogGalleryProps) {
    const [mainImage, setMainImage] = useState(imageUrls[0] || "");

    useEffect(() => {
        if (imageUrls.length > 0) setMainImage(imageUrls[0]);
    }, [imageUrls]);

    if (!imageUrls || imageUrls.length === 0) {
        return (
            <div className="flex items-center justify-center py-20 bg-slate-100 dark:bg-slate-800 relative w-full h-[300px]">
                <BookOpen className="h-12 w-12 text-slate-300" />
                <Badge className="absolute top-4 left-4 bg-indigo-600/90 hover:bg-indigo-600 border-none backdrop-blur-md z-10">
                    {category}
                </Badge>
            </div>
        );
    }

    return (
        <div className="flex flex-col md:flex-row w-full h-auto md:h-[500px] overflow-hidden bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800">
            {/* Main Image (75% on Desktop) */}
            <div
                className="relative w-full md:w-[75%] aspect-video md:aspect-auto md:h-full bg-slate-100 dark:bg-slate-800 overflow-hidden cursor-zoom-in group"
                onClick={() => onImageClick(mainImage)}
            >
                <img
                    src={mainImage}
                    alt={title}
                    className="object-cover w-full h-full transition-all duration-700 group-hover:scale-105"
                />
                <Badge className="absolute top-4 left-4 bg-indigo-600/90 hover:bg-indigo-600 border-none backdrop-blur-md z-10">
                    {category}
                </Badge>
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                    <Maximize2 className="text-white opacity-0 group-hover:opacity-100 transition-opacity h-12 w-12 drop-shadow-xl" />
                </div>
            </div>

            {/* Thumbnail Sidebar (25% on Desktop) */}
            <div className="w-full md:w-[25%] h-[100px] md:h-full flex md:flex-col overflow-x-auto md:overflow-y-auto bg-slate-50 dark:bg-slate-950/50 p-1 gap-1 border-t md:border-t-0 md:border-l border-slate-100 dark:border-slate-800 scrollbar-hide">
                {imageUrls.map((url, index) => (
                    <div
                        key={index}
                        className={`relative flex-shrink-0 w-[120px] md:w-full aspect-video md:h-1/5 overflow-hidden cursor-pointer transition-all border-2 ${mainImage === url ? 'border-indigo-600 z-10' : 'border-transparent opacity-60 hover:opacity-100'
                            }`}
                        onClick={() => setMainImage(url)}
                    >
                        <img
                            src={url}
                            alt={`${title} thumbnail ${index + 1}`}
                            className="object-cover w-full h-full"
                        />
                        {mainImage === url && (
                            <div className="absolute inset-0 bg-indigo-600/10 pointer-events-none" />
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}

export default function BlogsPage() {
    const { blogs, isLoading, fetchBlogs } = useBlogsStore();
    const [selectedImage, setSelectedImage] = useState<string | null>(null);

    useEffect(() => {
        fetchBlogs();
    }, [fetchBlogs]);

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pt-24 pb-12">
            <div className="container mx-auto px-4 sm:px-6">
                <div className="max-w-4xl mx-auto text-center mb-12">
                    <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-4">
                        Latest Blogs & Articles
                    </h1>
                    <p className="text-lg text-slate-600 dark:text-slate-400">
                        Stay updated with the latest news, guides, and insights from KTS.
                    </p>
                </div>

                {isLoading ? (
                    <div className="flex flex-col gap-12 max-w-4xl mx-auto">
                        {[1, 2].map((i) => (
                            <Card key={i} className="overflow-hidden border-none shadow-sm">
                                <Skeleton className="h-[400px] w-full" />
                                <div className="p-8 space-y-4">
                                    <Skeleton className="h-4 w-24" />
                                    <Skeleton className="h-8 w-3/4" />
                                    <div className="space-y-2">
                                        <Skeleton className="h-4 w-full" />
                                        <Skeleton className="h-4 w-full" />
                                        <Skeleton className="h-4 w-2/3" />
                                    </div>
                                </div>
                            </Card>
                        ))}
                    </div>
                ) : blogs.length === 0 ? (
                    <div className="text-center py-20 bg-white dark:bg-slate-900 rounded-3xl shadow-sm max-w-lg mx-auto border border-dashed border-slate-200">
                        <BookOpen className="h-16 w-16 text-slate-200 mx-auto mb-6" />
                        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">No blogs found</h2>
                        <p className="text-slate-500 dark:text-slate-400 mt-2">Check back later for new content!</p>
                    </div>
                ) : (
                    <div className="flex flex-col gap-12 max-w-4xl mx-auto">
                        {blogs.map((blog) => (
                            <div key={blog.id}>
                                <Card className="overflow-hidden border-none shadow-sm hover:shadow-2xl transition-all duration-500 h-full bg-white dark:bg-slate-900 rounded-3xl">
                                    <BlogGallery
                                        imageUrls={blog.imageUrls}
                                        title={blog.title}
                                        category={blog.category}
                                        onImageClick={(url) => setSelectedImage(url)}
                                    />

                                    <div className="p-8">
                                        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-slate-400 mb-4">
                                            <Calendar className="h-3.5 w-3.5" />
                                            {new Date(blog.createdAt).toLocaleDateString(undefined, {
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric'
                                            })}
                                        </div>
                                        <CardTitle className="text-3xl font-black text-slate-900 dark:text-white mb-6 leading-tight">
                                            {blog.title}
                                        </CardTitle>
                                        <CardContent className="p-0">
                                            <div className="text-slate-600 dark:text-slate-400 whitespace-pre-wrap leading-relaxed prose dark:prose-invert max-w-none text-lg">
                                                {blog.content}
                                            </div>
                                        </CardContent>
                                    </div>
                                </Card>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Lightbox Dialog (Wide View) */}
            <Dialog
                open={!!selectedImage}
                onOpenChange={(open) => !open && setSelectedImage(null)}
            >
                <DialogContent
                    className="
            w-screen h-screen
            max-w-none max-h-none
            p-0
            bg-black/95
            border-none
            shadow-none
            flex items-center justify-center
            backdrop-blur-xl
        "
                >
                    {selectedImage && (
                        <div className="relative w-full h-full flex items-center justify-center">
                            <img
                                src={selectedImage}
                                alt="Gallery View Wide"
                                className="w-full h-full object-contain"
                            />

                            <button
                                onClick={() => setSelectedImage(null)}
                                className="absolute top-6 right-6 bg-white/10 hover:bg-white/20 text-white p-3 rounded-2xl transition-all backdrop-blur-md border border-white/20"
                            >
                                <X className="h-6 w-6" />
                            </button>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
}
