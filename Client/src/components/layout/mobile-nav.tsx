"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import {
    Menu,
    Cpu,
    Home,
    Layers,
    Info,
    BookOpen,
    FileText,
    ShieldCheck,
    Layout,
    MessageSquare,
    Calendar,
    User,
    LogOut,
    Settings,
    Zap,
    ChevronRight,
    Sparkles
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { useAuthStore } from "@/store/useAuthStore";

interface MobileNavProps {
    user?: {
        name?: string | null;
        role?: string | null;
        profileImage?: string | null;
    };
}

export function MobileNav({ user }: MobileNavProps) {
    const [open, setOpen] = useState(false);
    const { logout } = useAuthStore();

    return (
        <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                    <Menu className="h-6 w-6" />
                    <span className="sr-only">Toggle menu</span>
                </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px] p-0 border-l border-slate-200/50 dark:border-slate-800/50 bg-white/80 dark:bg-slate-950/80 backdrop-blur-xl">
                <div className="flex flex-col h-full">
                    <SheetHeader className="p-6 text-left border-b border-slate-100 dark:border-slate-800/50">
                        <SheetTitle className="flex items-center gap-3">
                            <div className="relative h-9 w-9 overflow-hidden rounded-xl bg-indigo-50 dark:bg-indigo-950/30 p-1">
                                <Image
                                    src="/logo.png"
                                    alt="KTS Logo"
                                    fill
                                    className="object-contain p-1"
                                    priority
                                />
                            </div>
                            <span className="font-bold text-xl tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-300">
                                KTS
                            </span>
                        </SheetTitle>
                    </SheetHeader>

                    <div className="flex-1 overflow-y-auto custom-scrollbar p-6">
                        {/* User Profile Header in Menu */}
                        {user && (
                            <div className="mb-8 p-4 rounded-2xl bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-950/20 dark:to-purple-950/20 border border-indigo-100/50 dark:border-indigo-900/30">
                                <div className="flex items-center gap-4">
                                    {user.profileImage ? (
                                        <img src={user.profileImage} alt="" className="h-12 w-12 rounded-full object-cover border-2 border-white dark:border-slate-800 shadow-md" />
                                    ) : (
                                        <div className="h-12 w-12 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold shadow-md">
                                            {user.name?.charAt(0).toUpperCase()}
                                        </div>
                                    )}
                                    <div className="flex-1 min-w-0">
                                        <p className="font-bold text-slate-900 dark:text-white truncate">{user.name}</p>
                                        <p className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">{user.role}</p>
                                    </div>
                                </div>
                            </div>
                        )}

                        <div className="space-y-1">
                            <motion.div initial="closed" animate="open" variants={{ open: { transition: { staggerChildren: 0.05 } } }}>
                                {[
                                    { name: "Home", href: "/", icon: Home },
                                    { name: "Guides", href: "/guides", icon: BookOpen },
                                    { name: "Services", href: "/services", icon: Layers },
                                    { name: "About", href: "/about", icon: Info },
                                    { name: "Blogs", href: "/blogs", icon: FileText },
                                ].map((item) => (
                                    <motion.div key={item.name} variants={{ closed: { opacity: 0, x: -10 }, open: { opacity: 1, x: 0 } }}>
                                        <Link
                                            href={item.href}
                                            onClick={() => setOpen(false)}
                                            className="flex items-center gap-3 p-3 rounded-xl text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/30 transition-all duration-200 group"
                                        >
                                            <div className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 group-hover:bg-indigo-100 dark:group-hover:bg-indigo-900/50 transition-colors">
                                                <item.icon className="h-4 w-4" />
                                            </div>
                                            <span className="font-medium">{item.name}</span>
                                            <ChevronRight className="h-4 w-4 ml-auto opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                                        </Link>
                                    </motion.div>
                                ))}

                                {user?.role === 'STUDENT' && (
                                    <motion.div variants={{ closed: { opacity: 0, x: -10 }, open: { opacity: 1, x: 0 } }}>
                                        <Link
                                            href="/student/myService"
                                            onClick={() => setOpen(false)}
                                            className="flex items-center gap-3 p-3 rounded-xl text-indigo-600 dark:text-indigo-400 bg-indigo-50/50 dark:bg-indigo-950/20 mt-4 font-bold group"
                                        >
                                            <div className="p-2 rounded-lg bg-indigo-600 text-white shadow-lg shadow-indigo-500/20">
                                                <Zap className="h-4 w-4" />
                                            </div>
                                            <span>My Services</span>
                                            <Sparkles className="h-3 w-3 ml-auto animate-pulse" />
                                        </Link>
                                    </motion.div>
                                )}

                                {user?.role === 'ADMIN' && (
                                    <motion.div variants={{ closed: { opacity: 0, x: -10 }, open: { opacity: 1, x: 0 } }}>
                                        <Link
                                            href="/admin/analysis"
                                            onClick={() => setOpen(false)}
                                            className="flex items-center gap-3 p-3 rounded-xl text-indigo-600 dark:text-indigo-400 bg-indigo-50/50 dark:bg-indigo-950/20 mt-4 font-bold group"
                                        >
                                            <div className="p-2 rounded-lg bg-indigo-600 text-white shadow-lg shadow-indigo-500/20">
                                                <ShieldCheck className="h-4 w-4" />
                                            </div>
                                            <span>Admin Dashboard</span>
                                        </Link>
                                    </motion.div>
                                )}

                                {user?.role === 'MEMBER' && (
                                    <div className="space-y-1 mt-4">
                                        <p className="px-3 text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-2">Member Panel</p>
                                        {[
                                            { name: "Member Dashboard", href: "/members", icon: Layout },
                                            { name: "Messages", href: "/members/messages", icon: MessageSquare },
                                            { name: "Shift Schedule", href: "/member/schedule", icon: Calendar },
                                        ].map((item) => (
                                            <motion.div key={item.name} variants={{ closed: { opacity: 0, x: -10 }, open: { opacity: 1, x: 0 } }}>
                                                <Link
                                                    href={item.href}
                                                    onClick={() => setOpen(false)}
                                                    className="flex items-center gap-3 p-3 rounded-xl text-indigo-600 dark:text-indigo-400 bg-indigo-50/50 dark:bg-indigo-950/20 font-bold group"
                                                >
                                                    <div className="p-2 rounded-lg bg-indigo-600 text-white shadow-lg shadow-indigo-500/20">
                                                        <item.icon className="h-4 w-4" />
                                                    </div>
                                                    <span>{item.name}</span>
                                                </Link>
                                            </motion.div>
                                        ))}
                                    </div>
                                )}
                            </motion.div>
                        </div>
                    </div>

                    <div className="p-6 border-t border-slate-100 dark:border-slate-800/50 bg-slate-50/50 dark:bg-slate-900/30">
                        {user ? (
                            <div className="space-y-3">
                                <Link href="/settings/profile" onClick={() => setOpen(false)}>
                                    <Button className="w-full justify-start gap-3 rounded-xl border-slate-200 dark:border-slate-700 h-12" variant="outline">
                                        <Settings className="h-4 w-4 text-slate-500" />
                                        Your Account
                                    </Button>
                                </Link>
                                <Button
                                    variant="ghost"
                                    className="w-full justify-start gap-3 rounded-xl text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/20 h-12"
                                    onClick={() => {
                                        logout();
                                        setOpen(false);
                                    }}
                                >
                                    <LogOut className="h-4 w-4" />
                                    Sign Out
                                </Button>
                            </div>
                        ) : (
                            <Link href="/login" onClick={() => setOpen(false)} className="w-full">
                                <Button className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-xl h-12 shadow-lg shadow-indigo-500/20">
                                    Login
                                </Button>
                            </Link>
                        )}
                    </div>
                </div>
            </SheetContent>
        </Sheet>
    );
}
