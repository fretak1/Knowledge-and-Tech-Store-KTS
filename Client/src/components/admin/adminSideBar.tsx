"use client";

import { Button } from "../ui/button";
import {
    ChevronLeft,
    ChevronRight,
    ArrowLeft,
    Calendar,
    GraduationCap,
    LayoutDashboard,
    ListChecks,
    Users,
    BookOpen,
    BookText,
    Mail,
    User,
    Settings,
    UserPlus
} from "lucide-react";
import { useRouter, usePathname } from "next/navigation";
import { useAuthStore } from "@/store/useAuthStore";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { useMessageStore } from "@/store/useMessageStore";

interface SidebarProps {
    isOpen: boolean;
    toggle: () => void;
}

const menuItems = [
    { name: "Analysis", icon: LayoutDashboard, href: "/admin/analysis" },
    { name: "Applications", icon: UserPlus, href: "/admin/applications" },
    { name: "Members", icon: Users, href: "/admin/members" },
    { name: "Students", icon: GraduationCap, href: "/admin/students" },
    { name: "Events", icon: Calendar, href: "/admin/events" },
    { name: "Tasks", icon: ListChecks, href: "/admin/tasks" },
    { name: "Attendance", icon: Calendar, href: "/admin/attendance" },
    { name: "Schedule", icon: Calendar, href: "/admin/schedule" },
    { name: "Blogs", icon: BookOpen, href: "/admin/blogs" },
    { name: "Guides", icon: BookText, href: "/admin/guides" },
    { name: "Messages", icon: Mail, href: "/admin/messages" },
    { name: "Back to site", icon: ArrowLeft, href: "/" },
];

function AdminSidebar({ isOpen, toggle }: SidebarProps) {
    const router = useRouter();
    const pathname = usePathname();
    const { logout, user } = useAuthStore();
    const [mounted, setMounted] = useState(false);

    const { unreadCountForAdmin, getUnreadCount } = useMessageStore();



    // Fetch count on mount
    useEffect(() => {
        getUnreadCount();
    }, [getUnreadCount]);

    useEffect(() => {
        setMounted(true);
    }, []);

   

    if (!mounted) return null;

    return (
        <motion.div
            initial={false}
            animate={{ width: isOpen ? 280 : 80 }}
            transition={{ type: "spring", stiffness: 400, damping: 40 }}
            className="h-screen bg-indigo-900 text-indigo-300 shadow-2xl border-r border-white/5 flex flex-col overflow-hidden relative z-50 shadow-[4px_0_24px_rgba(0,0,0,0.1)]"
        >
            {/* Header / Logo Section */}
            <div className="flex h-20 items-center justify-between px-6 border-b border-white/5">
                <AnimatePresence mode="wait">
                    {isOpen && (
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="flex items-center gap-3"
                        >
                            <div className="h-8 w-8 bg-indigo-600 rounded-lg flex items-center justify-center font-black text-white text-xl shadow-lg shadow-indigo-500/20"> K </div>
                            <span className="text-sm font-black text-white tracking-[0.2em] uppercase">Admin Hub</span>
                        </motion.div>
                    )}
                </AnimatePresence>

                <Button
                    variant="ghost"
                    size="icon"
                    className={`text-gray-400 hover:text-white hover:bg-white/10 transition-colors rounded-xl
                        ${!isOpen ? "mx-auto" : ""}`}
                    onClick={toggle}
                >
                    {isOpen ? <ChevronLeft size={18} /> : <ChevronRight size={18} />}
                </Button>
            </div>

            {/* Menu Items */}
            <nav className="flex-1 py-6 px-4 space-y-1 overflow-y-auto no-scrollbar custom-scrollbar-hide">
                {menuItems.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <motion.div
                            whileHover={{ x: 4 }}
                            whileTap={{ scale: 0.98 }}
                            key={item.name}
                            onClick={() => router.push(item.href)}
                            className={`group flex items-center h-12 rounded-xl cursor-pointer transition-all duration-200 relative
                                ${isActive
                                    ? "bg-indigo-600/10 text-white"
                                    : "hover:bg-white/5 text-gray-400 hover:text-white"
                                }
                                ${!isOpen ? "justify-center px-0" : "px-4"}
                            `}
                        >
                            {isActive && (
                                <motion.div
                                    layoutId="activeIndicator"
                                    className="absolute left-0 w-1 h-6 bg-indigo-500 rounded-r-full"
                                />
                            )}
                            <div className="relative">
                                <item.icon
                                    size={20}
                                    className={`flex-shrink-0 transition-colors
                                    ${isActive ? "text-indigo-400" : "group-hover:text-indigo-400"}
                                `}
                                />
                                {!isActive && item.name === "Messages" && unreadCountForAdmin > 0 && (
                                    <span className="absolute -top-2 -right-2 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white ring-2 ring-indigo-900">
                                        {unreadCountForAdmin > 9 ? '9+' : unreadCountForAdmin}
                                    </span>
                                )}
                            </div>
                            <AnimatePresence>
                                {isOpen && (
                                    <motion.span
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -10 }}
                                        className="ml-4 font-bold text-sm whitespace-nowrap"
                                    >
                                        {item.name}
                                    </motion.span>
                                )}
                            </AnimatePresence>

                            {!isOpen && (
                                <div className="absolute left-full ml-4 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity font-bold border border-white/10 shadow-xl whitespace-nowrap z-[100]">
                                    {item.name}
                                </div>
                            )}
                        </motion.div>
                    );
                })}
            </nav>

        </motion.div>
    );
}

export default AdminSidebar;
