"use client";

import { useState, useEffect } from 'react';
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useEventStore } from "@/store/useEventStore";
import { Calendar, MapPin, ArrowRight, Clock, ChevronLeft, ChevronRight } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from '@/components/ui/badge';
import { useRouter } from "next/navigation";

interface Event {
    id: string;
    title: string;
    description: string;
    date: string; // From store it is string
    location: string;
    type: string;
    imageUrl?: string | null;
}

export default function EventsSection() {
    const { events, fetchEvents, isLoading } = useEventStore();
    const [upcomingIndex, setUpcomingIndex] = useState(0);
    const [pastIndex, setPastIndex] = useState(0);
    const router = useRouter();

    useEffect(() => {
        fetchEvents();
    }, [fetchEvents]);

    // Process dates for rendering
    const processedEvents = events.map(e => ({
        ...e,
        dateObj: new Date(e.date)
    }));

    const now = new Date();
    const upcomingEvents = processedEvents.filter(e => e.dateObj >= now).sort((a, b) => a.dateObj.getTime() - b.dateObj.getTime());
    const pastEvents = processedEvents.filter(e => e.dateObj < now).sort((a, b) => b.dateObj.getTime() - a.dateObj.getTime());

    const nextSlide = (type: 'upcoming' | 'past') => {
        if (type === 'upcoming') {
            setUpcomingIndex((prev) => (prev + 1) % upcomingEvents.length);
        } else {
            setPastIndex((prev) => (prev + 1) % pastEvents.length);
        }
    };

    const prevSlide = (type: 'upcoming' | 'past') => {
        if (type === 'upcoming') {
            setUpcomingIndex((prev) => (prev === 0 ? upcomingEvents.length - 1 : prev - 1));
        } else {
            setPastIndex((prev) => (prev === 0 ? pastEvents.length - 1 : prev - 1));
        }
    };

    if (isLoading) {
        return <div className="py-24 text-center">Loading events...</div>;
    }

    // Placeholders if no image
    const placeholderColors = [
        "bg-gradient-to-br from-indigo-500 to-purple-600",
        "bg-gradient-to-br from-blue-500 to-cyan-600",
        "bg-gradient-to-br from-emerald-500 to-teal-600",
        "bg-gradient-to-br from-orange-500 to-red-600",
    ];

    const CarouselCard = ({ event, type }: { event: any, type: 'upcoming' | 'past' }) => {
        const date = event.dateObj;
        // Deterministic color based on title length
        const bgClass = placeholderColors[event.title.length % placeholderColors.length];

        const ImageComponent = (
            <div className={`h-48 sm:h-64 md:h-auto w-full md:w-1/2 relative overflow-hidden ${bgClass} flex items-center justify-center`}>
                {event.imageUrl ? (
                    <img src={event.imageUrl} alt={event.title} className="absolute inset-0 w-full h-full object-cover" />
                ) : (
                    <div className="text-white text-center p-6">
                        <Calendar className="w-16 h-16 mx-auto mb-4 opacity-50" />
                        <span className="text-2xl font-bold opacity-50 block">{event.type}</span>
                    </div>
                )}

            </div>
        );

        const InfoComponent = (
            <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center bg-white dark:bg-slate-800">
                <div className='flex items-center gap-2 mb-4'>
                    <Badge variant="outline" className="border-indigo-500 text-indigo-500">{event.type}</Badge>
                    {type === 'upcoming' && <Badge className="bg-green-500 hover:bg-green-600">You All are Invited</Badge>}
                </div>

                <h3 className="text-2xl md:text-4xl font-bold mb-4 text-slate-900 dark:text-white">
                    {event.title}
                </h3>

                <div className="grid grid-cols-2 gap-4 mb-6 text-sm md:text-base text-slate-600 dark:text-slate-400">
                    <div className="flex items-center gap-2">
                        <Calendar className="w-5 h-5 text-indigo-500" />
                        <span>{date.toLocaleDateString(undefined, { weekday: 'short', month: 'long', day: 'numeric' })}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Clock className="w-5 h-5 text-indigo-500" />
                        <span>{date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                    <div className="flex items-center gap-2 col-span-2">
                        <MapPin className="w-5 h-5 text-indigo-500" />
                        <span>{event.location || 'Online'}</span>
                    </div>
                </div>

                <p className="text-slate-600 dark:text-slate-300 mb-8 leading-relaxed">
                    {event.description}
                </p>

                <div className="text-left">
                    {type === 'past' && (
                        <Button onClick={() => router.push(`/blogs`)} variant="outline" size="lg">
                            View Recap
                        </Button>
                    )}
                </div>
            </div>
        );

        return (
            <div className="flex flex-col md:flex-row h-full rounded-3xl overflow-hidden shadow-2xl mx-4">
                {type === 'upcoming' ? (
                    <>
                        {InfoComponent}
                        {ImageComponent}
                    </>
                ) : (
                    <>
                        {ImageComponent}
                        {InfoComponent}
                    </>
                )}
            </div>
        );
    };

    return (
        <section className="bg-slate-50 dark:bg-slate-950 py-24 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="container mx-auto px-4 md:px-6">
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-5xl font-bold mb-6 text-slate-900 dark:text-white">
                        Events Calendar
                    </h2>
                    <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
                        Join us for upcoming workshops or browse our past event archives.
                    </p>
                </div>

                <Tabs defaultValue="upcoming" className="w-full max-w-5xl mx-auto">
                    <div className="flex justify-center mb-12">
                        <TabsList className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-1 rounded-full shadow-md">
                            <TabsTrigger value="upcoming" className="rounded-full px-8 py-2 data-[state=active]:bg-indigo-600 data-[state=active]:text-white">Upcoming Events</TabsTrigger>
                            <TabsTrigger value="past" className="rounded-full px-8 py-2 data-[state=active]:bg-slate-700 data-[state=active]:text-white">Past Events</TabsTrigger>
                        </TabsList>
                    </div>

                    <TabsContent value="upcoming" className="mt-0">
                        {upcomingEvents.length > 0 ? (
                            <div className="relative group">
                                <CarouselCard event={upcomingEvents[upcomingIndex]} type="upcoming" />

                                {/* Navigation Arrows */}
                                <button onClick={() => prevSlide('upcoming')} className="absolute left-2 md:left-0 top-1/2 -translate-y-1/2 md:-translate-x-12 bg-white/90 dark:bg-slate-800/90 p-2 md:p-3 rounded-full shadow-lg hover:scale-110 transition-transform z-10 border border-slate-100 dark:border-slate-700">
                                    <ChevronLeft className="w-5 h-5 md:w-6 md:h-6 text-slate-700 dark:text-white" />
                                </button>
                                <button onClick={() => nextSlide('upcoming')} className="absolute right-2 md:right-0 top-1/2 -translate-y-1/2 md:translate-x-12 bg-white/90 dark:bg-slate-800/90 p-2 md:p-3 rounded-full shadow-lg hover:scale-110 transition-transform z-10 border border-slate-100 dark:border-slate-700">
                                    <ChevronRight className="w-5 h-5 md:w-6 md:h-6 text-slate-700 dark:text-white" />
                                </button>

                                {/* Dots */}
                                <div className="flex justify-center gap-2 mt-8">
                                    {upcomingEvents.map((_, idx) => (
                                        <button
                                            key={idx}
                                            onClick={() => setUpcomingIndex(idx)}
                                            className={`w-2.5 h-2.5 rounded-full transition-all ${idx === upcomingIndex ? 'bg-indigo-600 w-8' : 'bg-slate-300 dark:bg-slate-700'}`}
                                        />
                                    ))}
                                </div>
                            </div>
                        ) : (
                            <div className="text-center py-20 bg-white dark:bg-slate-900 rounded-3xl border border-dashed text-slate-500">
                                No upcoming events found.
                            </div>
                        )}
                    </TabsContent>

                    <TabsContent value="past" className="mt-0">
                        {pastEvents.length > 0 ? (
                            <div className="relative group">
                                <CarouselCard event={pastEvents[pastIndex]} type="past" />

                                {/* Navigation Arrows */}
                                <button onClick={() => prevSlide('past')} className="absolute left-2 md:left-0 top-1/2 -translate-y-1/2 md:-translate-x-12 bg-white/90 dark:bg-slate-800/90 p-2 md:p-3 rounded-full shadow-lg hover:scale-110 transition-transform z-10 border border-slate-100 dark:border-slate-700">
                                    <ChevronLeft className="w-5 h-5 md:w-6 md:h-6 text-slate-700 dark:text-white" />
                                </button>
                                <button onClick={() => nextSlide('past')} className="absolute right-2 md:right-0 top-1/2 -translate-y-1/2 md:translate-x-12 bg-white/90 dark:bg-slate-800/90 p-2 md:p-3 rounded-full shadow-lg hover:scale-110 transition-transform z-10 border border-slate-100 dark:border-slate-700">
                                    <ChevronRight className="w-5 h-5 md:w-6 md:h-6 text-slate-700 dark:text-white" />
                                </button>

                                {/* Dots */}
                                <div className="flex justify-center gap-2 mt-8">
                                    {pastEvents.map((_, idx) => (
                                        <button
                                            key={idx}
                                            onClick={() => setPastIndex(idx)}
                                            className={`w-2.5 h-2.5 rounded-full transition-all ${idx === pastIndex ? 'bg-slate-800 dark:bg-white w-8' : 'bg-slate-300 dark:bg-slate-700'}`}
                                        />
                                    ))}
                                </div>
                            </div>
                        ) : (
                            <div className="text-center py-20 bg-white dark:bg-slate-900 rounded-3xl border border-dashed text-slate-500">
                                No past events found.
                            </div>
                        )}
                    </TabsContent>
                </Tabs>

            </div>
        </section>
    );
}
