"use client";

import { useEffect, useState, useMemo } from "react";
import { useUserStore } from "@/store/useUserStore";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import {
    Search,
    Mail,
    Linkedin,
    Crown,
    Users,
    Github, // Imported
    Send,
} from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { getSocialLink, calculateAcademicYear } from "@/lib/utils";

export default function MembersListPage() {
    const { users, isLoading, getAllUsers } = useUserStore();
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        getAllUsers();
    }, [getAllUsers]);

    const admins = useMemo(() => users.filter(u => u.role === 'ADMIN'), [users]);

    const filteredMembers = useMemo(() => {
        return users.filter(user => {
            const isRegularMember = user.role === 'MEMBER';
            const matchesSearch =
                user.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                user.department?.toLowerCase().includes(searchQuery.toLowerCase());

            return isRegularMember && matchesSearch;
        });
    }, [users, searchQuery]);

    const getInitials = (name: string | null) => {
        if (!name) return "??";
        return name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pb-20">
                <header className="relative bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 py-20 mb-12 overflow-hidden">
                    <div className="container relative mx-auto px-6 text-center">
                        <Skeleton className="h-12 w-64 mx-auto mb-6" />
                        <Skeleton className="h-6 w-96 mx-auto" />
                    </div>
                </header>

                <div className="container mx-auto px-6">
                    <div className="max-w-2xl mx-auto mb-16">
                        <Skeleton className="h-14 w-full rounded-3xl" />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                            <Card key={i} className="h-[400px] border-none bg-white dark:bg-slate-900 rounded-[2rem] overflow-hidden">
                                <div className="p-10 flex flex-col items-center">
                                    <Skeleton className="h-28 w-28 rounded-full mb-6" />
                                    <Skeleton className="h-6 w-32 mb-2" />
                                    <Skeleton className="h-4 w-24 mb-6" />
                                    <div className="flex gap-4">
                                        <Skeleton className="h-10 w-10 rounded-xl" />
                                        <Skeleton className="h-10 w-10 rounded-xl" />
                                        <Skeleton className="h-10 w-10 rounded-xl" />
                                    </div>
                                </div>
                            </Card>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pb-20">
            <header className="relative bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 py-20 mb-12 overflow-hidden">
                <div className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] dark:bg-grid-slate-700/25 dark:[mask-image:linear-gradient(0deg,rgba(15,23,42,1),rgba(15,23,42,0.5))]" />
                <div className="container relative mx-auto px-6 text-center">
                    <h1 className="text-4xl md:text-6xl font-black mb-6 tracking-tight text-slate-900 dark:text-white">
                        Meet the <span className="text-indigo-600">KTS Crew</span>
                    </h1>
                    <p className="text-slate-500 dark:text-slate-400 max-w-2xl mx-auto text-lg">
                        A dedicated team of student innovators and support specialists.
                    </p>
                </div>
            </header>

            <div className="container mx-auto px-6">
                <section className="sticky top-24 z-30 mb-16">
                    <div className="bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl p-3 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm max-w-2xl mx-auto">
                        <div className="relative w-full">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                            <Input
                                placeholder="Search members by name or department..."
                                className="pl-12 h-14 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl focus-visible:ring-indigo-500 text-base"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                    </div>
                </section>

                {admins.length > 0 && searchQuery === "" && (
                    <section className="mb-24 flex flex-col items-center">
                        <div className="flex flex-wrap justify-center gap-8 w-full max-w-5xl">
                            {admins.map((admin) => (
                                <div key={admin.id} className="relative group w-full max-w-md">
                                    <div className="absolute -inset-1 bg-gradient-to-r from-amber-500 to-indigo-600 rounded-[2rem] blur opacity-20 group-hover:opacity-40 transition duration-500"></div>
                                    <Card className="relative bg-white dark:bg-slate-900 border-none rounded-[2rem] overflow-hidden shadow-xl">
                                        <CardContent className="p-0">
                                            <div className="flex flex-col sm:flex-row items-center">
                                                <div className="p-8">
                                                    <Avatar className="h-28 w-28 border-4 border-white dark:border-slate-800 shadow-xl">
                                                        <AvatarImage src={admin.profileImage || ""} />
                                                        <AvatarFallback className="bg-amber-500 text-white text-xl font-bold">
                                                            {getInitials(admin.name)}
                                                        </AvatarFallback>
                                                    </Avatar>
                                                </div>
                                                <div className="flex-1 p-6 text-center sm:text-left">
                                                    <Badge className="mb-2 bg-amber-500 hover:bg-amber-600 border-none">
                                                        KTS President
                                                    </Badge>
                                                    <h3 className="text-xl font-bold mb-1 text-slate-900 dark:text-white">{admin.name}</h3>
                                                    <p className="text-indigo-600 dark:text-indigo-400 font-semibold text-xs mb-4 uppercase tracking-wider">
                                                        {calculateAcademicYear(admin.batch, admin.department)}
                                                    </p>
                                                    <div className="flex gap-3 justify-center sm:justify-start">
                                                        <Link href={`mailto:${admin.email}`} className="text-slate-400 hover:text-indigo-600 transition-colors">
                                                            <Mail className="w-5 h-5" />
                                                        </Link>
                                                        {admin.linkedin && (
                                                            <Link href={getSocialLink(admin.linkedin, 'linkedin')} target="_blank" className="text-slate-400 hover:text-blue-600 transition-colors">
                                                                <Linkedin className="w-5 h-5" />
                                                            </Link>
                                                        )}
                                                        {admin.github && (
                                                            <Link href={getSocialLink(admin.github, 'github')} target="_blank" className="text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors">
                                                                <Github className="w-5 h-5" />
                                                            </Link>
                                                        )}
                                                        {admin.telegram && (
                                                            <Link href={getSocialLink(admin.telegram, 'telegram')} target="_blank" className="text-slate-400 hover:text-sky-500 transition-colors">
                                                                <Send className="w-5 h-5" />
                                                            </Link>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {filteredMembers.map((member) => (
                        <div key={member.id} className="group">
                            <Card className="h-full border-none bg-white dark:bg-slate-900 hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 rounded-[2rem] overflow-hidden">
                                <div className="h-2 bg-gradient-to-r from-indigo-500 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                                <CardHeader className="pt-10 flex flex-col items-center">
                                    <div className="relative mb-6">
                                        <div className="absolute -inset-2 bg-indigo-500/10 rounded-full scale-0 group-hover:scale-100 transition-transform duration-500" />
                                        <Avatar className="h-28 w-28 border-4 border-slate-50 dark:border-slate-800 shadow-lg">
                                            <AvatarImage src={member.profileImage || ""} className="object-cover" />
                                            <AvatarFallback className="bg-slate-100 dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 text-2xl font-black">
                                                {getInitials(member.name)}
                                            </AvatarFallback>
                                        </Avatar>
                                    </div>
                                    <div className="text-center px-4">
                                        <CardTitle className="text-xl font-bold text-slate-900 dark:text-white mb-1">
                                            {member.name}
                                        </CardTitle>
                                        <Badge variant="outline" className="text-[10px] uppercase tracking-[0.15em] font-bold text-slate-400 border-slate-200 dark:border-slate-800">
                                            {calculateAcademicYear(member.batch, member.department)}
                                        </Badge>
                                    </div>
                                </CardHeader>
                                <CardContent className="pb-10 pt-4">
                                    <div className="flex justify-center gap-4">
                                        <Link
                                            href={`mailto:${member.email}`}
                                            className="w-10 h-10 flex items-center justify-center rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-400 hover:text-white hover:bg-red-500 transition-all"
                                        >
                                            <Mail className="w-5 h-5" />
                                        </Link>
                                        {member.linkedin && (
                                            <Link
                                                href={getSocialLink(member.linkedin, 'linkedin')}
                                                target="_blank"
                                                className="w-10 h-10 flex items-center justify-center rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-400 hover:text-white hover:bg-blue-600 transition-all"
                                            >
                                                <Linkedin className="w-5 h-5" />
                                            </Link>
                                        )}
                                        {member.telegram && (
                                            <Link
                                                href={getSocialLink(member.telegram, 'telegram')}
                                                target="_blank"
                                                className="w-10 h-10 flex items-center justify-center rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-400 hover:text-white hover:bg-sky-500 transition-all"
                                            >
                                                <Send className="w-5 h-5" />
                                            </Link>
                                        )}
                                        {member.github && (
                                            <Link
                                                href={getSocialLink(member.github, 'github')}
                                                target="_blank"
                                                className="w-9 h-9 flex items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-900 hover:text-white dark:hover:bg-white dark:hover:text-slate-900 transition-colors duration-300"
                                            >
                                                <Github className="w-4.5 h-4.5" />
                                            </Link>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    ))}
                </div>

                {filteredMembers.length === 0 && (
                    <div className="text-center py-32 bg-white dark:bg-slate-900/50 rounded-[3rem] border-2 border-dashed border-slate-200 dark:border-slate-800 max-w-4xl mx-auto">
                        <Users className="w-16 h-16 text-slate-200 dark:text-slate-800 mx-auto mb-6 flex justify-center" />
                        <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">No members found</h3>
                        <p className="text-slate-500">We couldn't find anyone matching "{searchQuery}"</p>
                    </div>
                )}
            </div>
        </div>
    );
}