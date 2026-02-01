"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useGuideStore } from "@/store/useGuideStore";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PlayCircle } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export default function GuidesPage() {
    const { guides, fetchGuides, isLoading } = useGuideStore();

    useEffect(() => {
        fetchGuides();
    }, [fetchGuides]);

    const getVideoThumbnail = (videoUrl: string) => {
        // YouTube thumbnail
        if (videoUrl.includes('youtube.com') || videoUrl.includes('youtu.be')) {
            const videoId = videoUrl.includes('youtu.be')
                ? videoUrl.split('youtu.be/')[1]?.split('?')[0]
                : new URL(videoUrl).searchParams.get('v');
            return videoId ? `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg` : null;
        }
        // Cloudinary video thumbnail
        if (videoUrl.includes('cloudinary.com')) {
            return videoUrl.replace('/upload/', '/upload/so_0,w_800,h_450,c_fill/').replace(/\.[^.]+$/, '.jpg');
        }
        return null;
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-slate-50/50 dark:bg-slate-950/50">
                <div className="container mx-auto px-4 py-20">
                    <div className="text-center mb-20">
                        <Skeleton className="h-14 w-64 mx-auto mb-6" />
                        <Skeleton className="h-6 w-96 mx-auto" />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[1, 2, 3, 4, 5, 6].map((i) => (
                            <Card key={i} className="h-96 border-none bg-white dark:bg-slate-900 rounded-[2rem] overflow-hidden">
                                <Skeleton className="h-56 w-full" />
                                <div className="p-8 pb-4">
                                    <Skeleton className="h-8 w-3/4 mb-4" />
                                    <Skeleton className="h-4 w-full mb-2" />
                                    <Skeleton className="h-4 w-2/3" />
                                </div>
                            </Card>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50/50 dark:bg-slate-950/50">
            <div className="container mx-auto px-4 py-10 md:py-20">
                <div className="text-center mb-12 md:mb-20">
                    <h1 className="text-3xl md:text-6xl font-extrabold tracking-tight mb-6 py-2 bg-clip-text text-transparent bg-indigo-900 border-b-4 border-indigo-600 inline-block">
                        Knowledge Base
                    </h1>
                    <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                        Explore our curated collection of video guides designed to help you master new skills and solve common technical challenges.
                    </p>
                </div>

                {guides.length === 0 ? (
                    <div className="text-center py-20 bg-white dark:bg-slate-900 rounded-[2rem] border border-dashed border-slate-200 dark:border-slate-800">
                        <p className="text-slate-400 font-medium text-lg">No guides available yet. Check back soon!</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {guides.map((guide) => {
                            const thumbnail = getVideoThumbnail(guide.video);
                            return (
                                <Link key={guide.id} href={`/guides/${guide.id}`} className="group bg-white dark:bg-slate-900 rounded-[2rem] overflow-hidden border border-slate-100 dark:border-slate-800 hover:shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] transition-all duration-500 flex flex-col hover:-translate-y-1">
                                    {/* Video Thumbnail */}
                                    <div className="relative h-56 bg-slate-900 overflow-hidden">
                                        {thumbnail ? (
                                            <img
                                                src={thumbnail}
                                                alt={guide.title}
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                            />
                                        ) : (
                                            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/20 to-purple-500/20"></div>
                                        )}
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                                        <div className="absolute inset-0 flex items-center justify-center z-10">
                                            <div className="h-16 w-16 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center group-hover:bg-indigo-600 group-hover:scale-110 transition-all duration-500">
                                                <PlayCircle className="w-8 h-8 text-white" />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="p-8 pb-4 flex-1">
                                        <h3 className="text-2xl font-bold mb-4 text-slate-900 dark:text-white group-hover:text-indigo-600 transition-colors leading-tight">
                                            {guide.title}
                                        </h3>
                                        <p className="text-slate-500 dark:text-slate-400 leading-relaxed line-clamp-4">
                                            {guide.description}
                                        </p>
                                    </div>
                                    <div className="p-8 pt-4">
                                        <div className="inline-flex items-center justify-center w-full h-14 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 rounded-2xl font-bold group-hover:bg-indigo-600 group-hover:text-white dark:group-hover:bg-indigo-600 dark:group-hover:text-white transition-all gap-2">
                                            <PlayCircle className="w-5 h-5 group-hover:scale-110 transition-transform" />
                                            Watch Tutorial
                                        </div>
                                    </div>
                                </Link>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}
