"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { services, iconMap } from "@/data/services";
import { Sparkles, ArrowRight } from "lucide-react";
import {
    Carousel,
    CarouselContent,
    CarouselItem,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import { Button } from "../ui/button";

export default function ServicesSection() {
    return (
        <section className="bg-slate-50 dark:bg-slate-900 shadow-sm py-24 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-500/5 rounded-full blur-[100px] -z-10" />
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-[100px] -z-10" />

            <div className="container mx-auto px-6">
                <div className="text-center mb-20">
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-6 mb-12">
                            {/* Left Side: Title and Underline */}
                            <div className="flex flex-col">
                                {/* Removed mb-10 for a tighter, smoother fit */}
                                <h2 className="font-headline text-3xl md:text-4xl font-bold text-gray-800 mb-4">
                                    Our Services
                                </h2>
                                {/* Removed mb-8 so the flex container aligns to the actual bottom of this line */}
                                <div className="h-1.5 w-50 bg-indigo-500 rounded-full" />
                            </div>

                            {/* Right Side: Button */}
                            <div className="pb-1"> {/* Optional: small padding-bottom to match text baseline */}
                                <Link href="/services">
                                    <Button
                                        size="lg"
                                        className="px-10 h-14 rounded-2xl bg-indigo-500 text-white font-bold text-lg 
             transition-all duration-300 ease-out
             hover:bg-indigo-600  hover:shadow-[0_10px_20px_-5px_rgba(99,102,241,0.4)] 
             active:scale-95"
                                    >                                       See All Services
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </motion.div>
                </div>

                <div className="animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-150 fill-mode-forwards px-4 md:px-12">
                    <Carousel
                        opts={{
                            align: "start",
                            loop: true,
                        }}
                        plugins={[
                            Autoplay({
                                delay: 3000,
                                stopOnInteraction: false,
                            }),
                        ]}
                        className="w-full"
                    >
                        <CarouselContent className="-ml-6">
                            {[...services, ...services, ...services].map((service, i) => {
                                const IconComponent = iconMap[service.icon] || Sparkles;
                                return (
                                    <CarouselItem key={`${service.id}-${i}`} className="pl-6 md:basis-1/2 lg:basis-1/3">
                                        <Link href={`/services?category=${service.category}`} className="block group h-full">
                                            <div className="bg-white dark:bg-slate-800 rounded-[2rem] p-8 shadow-sm hover:shadow-2xl transition-all duration-500 border border-slate-100 dark:border-slate-700 h-full flex flex-col group-hover:-translate-y-3">
                                                <div className="mb-8 p-5 bg-indigo-50 dark:bg-indigo-900/30 rounded-2xl w-fit group-hover:scale-110 group-hover:bg-indigo-100 dark:group-hover:bg-indigo-900/50 transition-all duration-300">
                                                    <IconComponent className="w-8 h-8 text-indigo-600 dark:text-indigo-400" />
                                                </div>
                                                <h3 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                                                    {service.title}
                                                </h3>
                                                <p className="text-slate-600 dark:text-slate-400 leading-relaxed mb-8 flex-grow">
                                                    {service.description}
                                                </p>

                                            </div>
                                        </Link>
                                    </CarouselItem>
                                );
                            })}
                        </CarouselContent>

                    </Carousel>

                </div>
            </div>
        </section>
    );
}
