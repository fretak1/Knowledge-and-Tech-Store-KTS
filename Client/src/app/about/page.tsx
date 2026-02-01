"use client";

import { useEffect } from "react";
import { useMemberStore } from "@/store/useMemberStore";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { motion } from "framer-motion"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import {
    Cpu,
    Target,
    Rocket,
    Users,
    ShieldCheck,
    Zap,
    Lightbulb,
    Github,
    Linkedin,
    Calendar,
    ChevronRight,
    Send,
    Mail
} from "lucide-react";
import Link from "next/link";

export default function AboutPage() {
    const { members, isLoading, fetchMembers } = useMemberStore();

    useEffect(() => {
        fetchMembers();
    }, [fetchMembers]);

    const getInitials = (name: string | null) => {
        if (!name) return "??";
        return name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
    };

    const historyEvents = [
        {
            year: "2022",
            title: "The Library Spark",
            description: "Started as a group of three friends fixing laptops for classmates in the main library study rooms.",
            icon: <Lightbulb className="w-5 h-5" />
        },
        {
            year: "2023",
            title: "Official Recognition",
            description: "KTS was officially recognized as a campus organization, gaining our first dedicated workshop space.",
            icon: <ShieldCheck className="w-5 h-5" />
        },
        {
            year: "2024",
            title: "Digital Expansion",
            description: "Launched our online booking system and knowledge base, reaching over 500 students in a single semester.",
            icon: <Rocket className="w-5 h-5" />
        },
        {
            year: "2025",
            title: "Beyond Repairs",
            description: "Expanded into software workshops, coding bootcamps, and professional tech consultations.",
            icon: <Cpu className="w-5 h-5" />
        }
    ];

    return (
        <div className="flex flex-col min-h-screen bg-white dark:bg-slate-950">
            {/* Hero Section */}
            <section className="relative overflow-hidden py-24 md:py-32">
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/10 via-purple-600/5 to-transparent -z-10" />
                <div className="container mx-auto px-6 text-center">

                    <h1 className="text-4xl md:text-6xl font-extrabold mb-6 tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-300">
                        Empowering Students Through <br />
                        <span className="text-indigo-900 dark:text-indigo-400">Exceptional Technology</span>
                    </h1>
                    <p className="text-lg md:text-xl max-w-2xl mx-auto text-slate-600 dark:text-slate-400 leading-relaxed">
                        KTS is a student-led organization bridging the gap between technical challenges
                        and academic success through reliable support and innovative solutions.
                    </p>
                </div>
            </section>

            {/* Stats Section */}
            <section className="py-12 -mt-12 relative z-10">
                <div className="container mx-auto px-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
                        {[
                            { label: "Students Helped", value: "500+", color: "from-blue-500 to-indigo-600" },
                            { label: "Devices Repaired", value: "1,000+", color: "from-indigo-600 to-purple-600" },
                            { label: "Satisfaction Rate", value: "98%", color: "from-purple-600 to-pink-600" },
                        ].map((stat, i) => (
                            <div key={i} className="relative group">
                                <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-300"></div>
                                <div className="relative flex flex-col items-center justify-center p-8 rounded-2xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 shadow-xl">
                                    <span className={`text-4xl md:text-5xl font-black bg-clip-text text-transparent bg-gradient-to-r ${stat.color}`}>
                                        {stat.value}
                                    </span>
                                    <span className="text-slate-500 dark:text-slate-400 font-medium mt-2 uppercase tracking-widest text-[10px]">
                                        {stat.label}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* History Section - Timeline UI */}
            <section className="py-24 overflow-hidden bg-slate-50/50 dark:bg-slate-900/20">
                <div className="container mx-auto px-6">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold mb-4">Our Journey</h2>
                        <p className="text-slate-500">From a small idea to a campus movement</p>
                    </div>

                    <div className="max-w-4xl mx-auto relative">
                        {/* Vertical Line */}
                        <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-0.5 bg-slate-200 dark:bg-slate-800 md:-translate-x-1/2 hidden sm:block" />

                        <div className="space-y-12">
                            {historyEvents.map((event, index) => (
                                <div key={index} className={`relative flex flex-col md:flex-row items-center ${index % 2 === 0 ? 'md:flex-row-reverse' : ''}`}>
                                    {/* Timeline Dot */}
                                    <div className="absolute left-4 md:left-1/2 w-8 h-8 rounded-full bg-white dark:bg-slate-950 border-4 border-indigo-600 md:-translate-x-1/2 z-10 hidden sm:flex items-center justify-center text-indigo-600 shadow-lg">
                                        <div className="w-2 h-2 rounded-full bg-indigo-600 animate-pulse" />
                                    </div>

                                    {/* Content Card */}
                                    <div className="w-full md:w-5/12 ml-10 md:ml-0">
                                        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow">
                                            <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-bold mb-2">
                                                <Calendar className="w-4 h-4" />
                                                <span>{event.year}</span>
                                            </div>
                                            <h4 className="text-xl font-bold mb-2 text-slate-900 dark:text-white">{event.title}</h4>
                                            <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                                                {event.description}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Mission & Vision */}
            <section className="py-24">
                <div className="container mx-auto px-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
                        <div className="group p-8 rounded-3xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 transition-all duration-300 hover:bg-white hover:shadow-xl">
                            <div className="w-12 h-12 rounded-2xl bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center text-indigo-600 dark:text-indigo-400 mb-6">
                                <Target className="w-6 h-6" />
                            </div>
                            <h3 className="text-2xl font-bold mb-4">Our Mission</h3>
                            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                                To provide accessible, high-quality tech services that ensure no student is held back
                                by technical limitations. We turn tech frustration into digital fluency.
                            </p>
                        </div>
                        <div className="group p-8 rounded-3xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 transition-all duration-300 hover:bg-white hover:shadow-xl">
                            <div className="w-12 h-12 rounded-2xl bg-purple-100 dark:bg-purple-900/50 flex items-center justify-center text-purple-600 dark:text-purple-400 mb-6">
                                <Rocket className="w-6 h-6" />
                            </div>
                            <h3 className="text-2xl font-bold mb-4">Our Vision</h3>
                            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                                To foster a campus ecosystem where students support students, building a
                                collaborative community of tech-savvy future professionals.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Team Showcase */}
            <section className="bg-white dark:bg-slate-950 py-24 relative overflow-hidden">
                {/* Background Blob */}
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-50/50 dark:bg-indigo-900/10 rounded-full blur-3xl -z-10 translate-x-1/2 -translate-y-1/2"></div>

                <div className="container mx-auto px-6">
                    <div className="text-center mb-16 animate-in fade-in slide-in-from-bottom-4 duration-700 fade-out-0 zoom-in-95">
                        <h2 className="text-3xl md:text-5xl font-bold mb-6 text-slate-900 dark:text-white">
                            Meet Our Members
                        </h2>

                    </div>

                    {isLoading ? (
                        <div className="text-center py-12">
                            <p className="text-slate-500">Loading members...</p>
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
                                        delay: 3000,
                                        stopOnInteraction: false,
                                        stopOnMouseEnter: true
                                    }),
                                ]}
                                className="w-full"
                            >
                                <CarouselContent className="-ml-4">
                                    {([...members, ...members]).map((member, index) => (
                                        <CarouselItem key={`${member.id}-${index}`} className="pl-4 md:basis-1/3 lg:basis-1/4">
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
                                                        {member.department || "Contributor"}
                                                    </p>

                                                    {/* Social Links */}
                                                    <div className="flex gap-3 mt-auto justify-center">

                                                        <motion.div whileHover={{ y: -3, scale: 1.1 }} whileTap={{ scale: 0.95 }}>
                                                            <Link
                                                                href={member.github || "#"}
                                                                target="_blank"
                                                                className="w-9 h-9 flex items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-900 hover:text-white dark:hover:bg-white dark:hover:text-slate-900 transition-colors duration-300"
                                                            >
                                                                <Github className="w-4.5 h-4.5" />
                                                            </Link>
                                                        </motion.div>

                                                        <motion.div whileHover={{ y: -3, scale: 1.1 }} whileTap={{ scale: 0.95 }}>
                                                            <Link
                                                                href={member.linkedin || "#"}
                                                                target="_blank"
                                                                className="w-9 h-9 flex items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-blue-600 hover:text-white transition-colors duration-300"
                                                            >
                                                                <Linkedin className="w-4.5 h-4.5" />
                                                            </Link>
                                                        </motion.div>
                                                        <motion.div whileHover={{ y: -3, scale: 1.1 }} whileTap={{ scale: 0.95 }}>
                                                            <Link
                                                                href={member.telegram || "#"}
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

                            <div className="text-center mt-12">
                                <Link href="/members/memberList">
                                    <Button className="bg-indigo-600 hover:bg-indigo-700 rounded-md px-6">
                                        See All Members
                                    </Button>
                                </Link>
                            </div>
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
        </div>
    );
}