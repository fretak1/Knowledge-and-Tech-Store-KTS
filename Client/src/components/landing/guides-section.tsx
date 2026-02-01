"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useGuideStore } from "@/store/useGuideStore";
import { Badge } from "@/components/ui/badge";
import { PlayCircle } from "lucide-react";
import {
    Carousel,
    CarouselContent,
    CarouselItem,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";

export default function GuidesSection() {
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

    return (
        <section className="bg-white dark:bg-slate-950 py-24 overflow-hidden">
            <div className="container mx-auto px-6">
                <div className="text-center mb-16">
                    <h2 className="text-4xl md:text-6xl font-black mb-6 text-slate-900 dark:text-white tracking-tight">
                        Knowledge Center
                    </h2>
                    <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
                        Solve your problems with our step-by-step video guides.
                    </p>
                </div>

                {isLoading ? (
                    <div className="flex justify-center py-20">
                        <div className="h-10 w-10 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin"></div>
                    </div>
                ) : (
                    <div className="px-4 md:px-12">
                        <Carousel
                            opts={{
                                align: "start",
                                loop: guides.length > 3,
                            }}
                            plugins={[
                                Autoplay({
                                    delay: 5000,
                                    stopOnInteraction: false,
                                }),
                            ]}
                            className="w-full"
                        >
                            <CarouselContent className="-ml-6">
                                {guides.map((guide) => {
                                    const thumbnail = getVideoThumbnail(guide.video);
                                    return (
                                        <CarouselItem key={guide.id} className="pl-6 md:basis-1/2 lg:basis-1/3">
                                            <Link href={`/guides/${guide.id}`} className="group block h-full">
                                                <div className="flex flex-col h-full bg-white dark:bg-slate-900 rounded-[2rem] overflow-hidden border border-slate-100 dark:border-slate-800 hover:shadow-[0_40px_80px_-20px_rgba(0,0,0,0.1)] transition-all duration-500 transform group-hover:-translate-y-2">
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
                                                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10"></div>
                                                        <div className="absolute inset-0 flex items-center justify-center z-20">
                                                            <div className="h-16 w-16 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center group-hover:bg-indigo-600 group-hover:scale-110 transition-all duration-500">
                                                                <PlayCircle className="w-8 h-8 text-white" />
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="p-8 flex-1 flex flex-col">
                                                        <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-4 line-clamp-2 leading-tight group-hover:text-indigo-600 transition-colors">
                                                            {guide.title}
                                                        </h3>
                                                        <p className="text-slate-500 dark:text-slate-400 text-sm line-clamp-3 mb-6 flex-1 leading-relaxed">
                                                            {guide.description}
                                                        </p>
                                                    </div>
                                                </div>
                                            </Link>
                                        </CarouselItem>
                                    );
                                })}
                            </CarouselContent>
                        </Carousel>
                    </div>
                )}

                <div className="text-center mt-10">
                    <Link href="/guides">
                        <Button
                            size="lg"
                            className="px-10 h-14 rounded-2xl bg-indigo-500 text-white font-bold text-lg 
                                    transition-all duration-300 ease-out
                                    hover:bg-indigo-600  hover:shadow-[0_10px_20px_-5px_rgba(99,102,241,0.4)] 
                                    active:scale-95"
                        >
                            See All Guides
                        </Button>
                    </Link>
                </div>
            </div>
        </section>
    );
}
