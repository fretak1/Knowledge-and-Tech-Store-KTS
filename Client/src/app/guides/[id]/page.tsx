"use client";

import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useGuideStore } from "@/store/useGuideStore";
import { ArrowLeft, PlayCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function GuideDetailPage() {
    const params = useParams();
    const router = useRouter();
    const { guide, fetchGuideById, isLoading } = useGuideStore();
    const guideId = params.id as string;

    useEffect(() => {
        if (guideId) {
            fetchGuideById(guideId);
        }
    }, [guideId, fetchGuideById]);

    const getEmbedUrl = (videoUrl: string) => {
        // YouTube embed
        if (videoUrl.includes('youtube.com') || videoUrl.includes('youtu.be')) {
            const videoId = videoUrl.includes('youtu.be')
                ? videoUrl.split('youtu.be/')[1]?.split('?')[0]
                : new URL(videoUrl).searchParams.get('v');
            return videoId ? `https://www.youtube.com/embed/${videoId}` : null;
        }
        // Cloudinary video - return direct URL
        if (videoUrl.includes('cloudinary.com')) {
            return videoUrl;
        }
        return videoUrl;
    };

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50/50 dark:bg-slate-950/50">
                <div className="flex flex-col items-center gap-4">
                    <div className="h-12 w-12 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin"></div>
                    <p className="text-muted-foreground font-medium">Loading guide...</p>
                </div>
            </div>
        );
    }

    if (!guide) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50/50 dark:bg-slate-950/50">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">Guide not found</h2>
                    <Button onClick={() => router.push('/guides')} className="bg-indigo-600 hover:bg-indigo-700">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back to Guides
                    </Button>
                </div>
            </div>
        );
    }

    const embedUrl = getEmbedUrl(guide.video);
    const isYouTube = guide.video.includes('youtube.com') || guide.video.includes('youtu.be');

    return (
        <div className="min-h-screen bg-slate-50/50 dark:bg-slate-950/50">
            <div className="container mx-auto px-4 py-12">
                <div className="max-w-5xl mx-auto">
                    <div className="bg-white dark:bg-slate-900 rounded-[2rem] overflow-hidden border border-slate-100 dark:border-slate-800 shadow-xl">
                        {/* Video Player */}
                        <div className="relative w-full bg-slate-900" style={{ paddingBottom: '56.25%' }}>
                            {isYouTube ? (
                                <iframe
                                    src={embedUrl || ''}
                                    className="absolute inset-0 w-full h-full"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                    title={guide.title}
                                />
                            ) : (
                                <video
                                    src={embedUrl || ''}
                                    controls
                                    className="absolute inset-0 w-full h-full object-contain"
                                    title={guide.title}
                                >
                                    Your browser does not support the video tag.
                                </video>
                            )}
                        </div>

                        {/* Content */}
                        <div className="p-8 md:p-12">
                            <h1 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white mb-6 leading-tight">
                                {guide.title}
                            </h1>
                            <div className="prose prose-lg dark:prose-invert max-w-none">
                                <p className="text-xl text-slate-600 dark:text-slate-400 leading-relaxed">
                                    {guide.description}
                                </p>
                            </div>

                            <div className="mt-8 pt-8 border-t border-slate-100 dark:border-slate-800">
                                <a
                                    href={guide.video}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-2 text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 font-semibold transition-colors"
                                >
                                    <PlayCircle className="w-5 h-5" />
                                    Open video in new tab
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
