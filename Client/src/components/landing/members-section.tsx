"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useMemberStore } from "@/store/useMemberStore";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Github, Linkedin, Mail, Send } from "lucide-react";
import { motion } from "framer-motion";
import {
    Carousel,
    CarouselContent,
    CarouselItem,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import { Skeleton } from "@/components/ui/skeleton";
import { getSocialLink, calculateAcademicYear } from "@/lib/utils";

export default function MembersSection() {
    const { members, fetchMembers, isLoading } = useMemberStore();

    useEffect(() => {
        fetchMembers();
    }, [fetchMembers]);

    // Helper function to get initials from name
    const getInitials = (name: string | null) => {
        if (!name) return "??";
        return name
            .split(" ")
            .map((n) => n[0])
            .join("")
            .toUpperCase()
            .slice(0, 2);
    };

    return (
        <section className="bg-white dark:bg-slate-950 py-24 relative overflow-hidden">
            {/* Background Blob */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-50/50 dark:bg-indigo-900/10 rounded-full blur-3xl -z-10 translate-x-1/2 -translate-y-1/2"></div>

            <div className="container mx-auto px-6">
                <div className="text-left mb-16 animate-in fade-in slide-in-from-bottom-4 duration-700 fade-out-0 zoom-in-95">
                    <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-6 mb-12">
                        {/* Left Side: Title and Underline */}
                        <div className="flex flex-col">
                            {/* Removed mb-10 for a tighter, smoother fit */}
                            <h2 className="font-headline text-3xl md:text-4xl font-bold text-gray-800 mb-4">
                                Meet Our Member
                            </h2>
                            {/* Removed mb-8 so the flex container aligns to the actual bottom of this line */}
                            <div className="h-1.5 w-74 bg-indigo-500 rounded-full" />
                        </div>

                        {/* Right Side: Button */}
                        <div className="pb-1"> {/* Optional: small padding-bottom to match text baseline */}
                            <Link href="/members/memberList">
                                <Button
                                    size="lg"
                                    className="px-10 h-14 rounded-2xl bg-indigo-500 text-white font-bold text-lg 
                                    transition-all duration-300 ease-out
                                    hover:bg-indigo-600  hover:shadow-[0_10px_20px_-5px_rgba(99,102,241,0.4)] 
                                    active:scale-95"
                                >
                                    See All Members
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>

                {isLoading ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 animate-pulse">
                        {[1, 2, 3, 4].map((i) => (
                            <div key={i} className="p-8 rounded-[2rem] bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800 flex flex-col items-center">
                                <Skeleton className="h-32 w-32 rounded-full mb-6" />
                                <Skeleton className="h-6 w-32 mb-2" />
                                <Skeleton className="h-4 w-24 mb-6" />
                                <div className="flex gap-3">
                                    <Skeleton className="h-9 w-9 rounded-full" />
                                    <Skeleton className="h-9 w-9 rounded-full" />
                                    <Skeleton className="h-9 w-9 rounded-full" />
                                </div>
                            </div>
                        ))}
                    </div>
                ) : members.length > 0 ? (
                    <div className="mx-auto px-12 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-150 fill-mode-forwards">
                        <Carousel
                            opts={{
                                align: "start",
                                loop: true,
                            }}
                            plugins={[
                                Autoplay({
                                    delay: 4000,
                                    stopOnInteraction: false,
                                }),
                            ]}
                            className="w-full"
                        >
                            <CarouselContent className="-ml-4">
                                {([...members, ...members]).map((member, i) => (
                                    <CarouselItem key={`${member.id}-${i}`} className="pl-4 md:basis-1/3 lg:basis-1/4">
                                        <div className="group relative h-full p-2">
                                            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-2xl transition-all duration-300 text-center relative z-10 h-full flex flex-col items-center transform hover:-translate-y-2">

                                                <div className="mb-6 relative">
                                                    <div className="absolute inset-0 bg-indigo-500 rounded-full blur-lg opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
                                                    <Avatar className="h-32 w-32 border-4 border-white dark:border-slate-800 shadow-lg group-hover:scale-105 transition-transform duration-300">
                                                        <AvatarImage src={member.profileImage || undefined} alt={member.name || "Member"} className="object-cover" />
                                                        <AvatarFallback className="text-3xl bg-indigo-50 dark:bg-indigo-900 text-indigo-600 dark:text-indigo-300 font-bold">
                                                            {getInitials(member.name)}
                                                        </AvatarFallback>
                                                    </Avatar>
                                                </div>

                                                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-1 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                                                    {member.name || "Team Member"}
                                                </h3>
                                                <p className="text-sm font-medium text-indigo-500 mb-4 uppercase tracking-wider">
                                                    {calculateAcademicYear(member.batch, member.department)}
                                                </p>

                                                {/* Social Links */}
                                                <div className="flex gap-3 mt-auto justify-center">

                                                    <motion.div whileHover={{ y: -3, scale: 1.1 }} whileTap={{ scale: 0.95 }}>
                                                        <Link
                                                            href={getSocialLink(member.github, 'github')}
                                                            target="_blank"
                                                            className="w-9 h-9 flex items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-900 hover:text-white dark:hover:bg-white dark:hover:text-slate-900 transition-colors duration-300"
                                                        >
                                                            <Github className="w-4.5 h-4.5" />
                                                        </Link>
                                                    </motion.div>

                                                    <motion.div whileHover={{ y: -3, scale: 1.1 }} whileTap={{ scale: 0.95 }}>
                                                        <Link
                                                            href={getSocialLink(member.linkedin, 'linkedin')}
                                                            target="_blank"
                                                            className="w-9 h-9 flex items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-blue-600 hover:text-white transition-colors duration-300"
                                                        >
                                                            <Linkedin className="w-4.5 h-4.5" />
                                                        </Link>
                                                    </motion.div>
                                                    <motion.div whileHover={{ y: -3, scale: 1.1 }} whileTap={{ scale: 0.95 }}>
                                                        <Link
                                                            href={getSocialLink(member.telegram, 'telegram')}
                                                            target="_blank"
                                                            className="w-9 h-9 flex items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-sky-500 hover:text-white transition-colors duration-300"
                                                        >
                                                            <Send className="w-4.5 h-4.5" />
                                                        </Link>
                                                    </motion.div>

                                                    <motion.div whileHover={{ y: -3, scale: 1.1 }} whileTap={{ scale: 0.95 }}>
                                                        <a
                                                            href={`https://mail.google.com/mail/?view=cm&fs=1&to=${member.email}`} className="w-9 h-9 flex items-center justify-center rounded-full
                                                            bg-slate-100 dark:bg-slate-800
                                                            text-slate-600 dark:text-slate-400
                                                            hover:bg-red-500 hover:text-white
                                                            transition-colors duration-300"
                                                            target="_blank"

                                                        >
                                                            <Mail className="w-4.5 h-4.5" />
                                                        </a>
                                                    </motion.div>
                                                </div>
                                            </div>
                                        </div>
                                    </CarouselItem>
                                ))}
                            </CarouselContent>
                        </Carousel>

                    </div>
                ) : (
                    <div className="text-center py-12 bg-slate-50 dark:bg-slate-900 rounded-3xl border border-dashed border-slate-300 dark:border-slate-700">
                        <p className="text-slate-500 dark:text-slate-400 mb-6 text-lg">
                            Building our dream team. Be the first to join!
                        </p>
                        <Link href="/signup">
                            <Button size="lg">Become a Member</Button>
                        </Link>
                    </div>
                )}
            </div>
        </section>
    );
}
