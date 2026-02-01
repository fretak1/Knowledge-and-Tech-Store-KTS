"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/store/useAuthStore";
import { useNotificationStore } from "@/store/useNotificationStore"; // 1. Import Store
import { MobileNav } from "./mobile-nav";
import {
    Cpu,
    User,
    Settings,
    LogOut,
    ShieldCheck,
    Bell,
    ChevronDown,
    MessageSquare,
    CheckSquare,
    Sparkles,
    Calendar,
} from "lucide-react";
import { useMessageStore } from "@/store/useMessageStore";
import { useApplicationStore } from "@/store/useApplicationStore";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { formatDistanceToNow } from "date-fns";


export default function Navbar() {
    const { user, logout } = useAuthStore();
    const { getUnreadCount, unreadCountForMember, markAllAsRead: markMessagesAsRead } = useMessageStore();
    const { isOpen, fetch } = useApplicationStore();
    
    

    // 2. Access Notification State
    const { unreadCount, notifications, markAllAsRead, getNotifications } = useNotificationStore();

    useEffect(() => {
        fetch();
        getUnreadCount();

        // 3. Fetch notifications if the user is a student
        if (user?.role === "STUDENT") {
            getNotifications();
        }
    }, [fetch, getUnreadCount, getNotifications, user?.role]);



    return (
        <nav className="sticky top-0 z-50 w-full border-b border-slate-200/50 dark:border-slate-800/50 bg-white/70 dark:bg-slate-950/70 backdrop-blur-xl supports-[backdrop-filter]:bg-white/60">
            <div className="container mx-auto flex h-16 items-center justify-between px-6 transition-all duration-300">
                {/* Logo Section */}
                <Link href="/" className="flex items-center gap-2 group outline-none">
                    <div className="relative h-10 w-24">
                        <Image
                            src="/logo.png"
                            alt="KTS Logo"
                            fill
                            className="object-contain object-left"
                            priority
                        />
                    </div>
                </Link>

                {/* Desktop Navigation */}
                <div className="hidden md:flex items-center gap-8">
                    {isOpen && user?.role !== 'ADMIN' && user?.role !== 'MEMBER' && (
                        <Link href="/apply">
                            <Button size="sm" className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg hover:shadow-indigo-500/30 transition-all animate-pulse hover:animate-none">
                                <Sparkles className="h-4 w-4" />
                                Apply Now
                            </Button>
                        </Link>
                    )}
                    {user?.role === 'ADMIN' && (
                        <Link href="/admin/analysis" className="relative text-sm font-medium text-indigo-600 dark:text-indigo-400 group">
                            Admin Dashboard
                            <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-indigo-600 origin-left transform scale-x-0 transition-transform duration-300 group-hover:scale-x-100" />
                        </Link>
                    )}
                    {user?.role === 'MEMBER' && (
                        <DropdownMenu>
                            <DropdownMenuTrigger className="group relative flex items-center gap-1 text-sm font-medium text-indigo-600 dark:text-indigo-400 outline-none">
                                <span>Member Dashboard</span>
                                <ChevronDown className="h-4 w-4 transition-transform duration-200 group-data-[state=open]:rotate-180" />
                                {unreadCountForMember > 0 && (
                                    <span className="ml-1 flex h-2 w-2 rounded-full bg-red-500 ring-2 ring-white dark:ring-slate-950 animate-pulse" />
                                )}
                                <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-indigo-600 origin-left transform scale-x-0 transition-transform duration-300 group-hover:scale-x-100" />
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-56 p-2 rounded-xl border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-950/95 backdrop-blur-xl shadow-xl animate-in fade-in-80 zoom-in-95 data-[side=bottom]:slide-in-from-top-2">
                                <DropdownMenuItem asChild>
                                    <Link
                                        href="/members/messages"
                                        onClick={() => markMessagesAsRead()}
                                        className="flex items-center justify-between cursor-pointer p-2.5 rounded-lg text-slate-600 dark:text-slate-300 focus:text-indigo-600 dark:focus:text-indigo-400 focus:bg-indigo-50 dark:focus:bg-indigo-950/30 transition-all duration-200"
                                    >
                                        <div className="flex items-center gap-2.5">
                                            <div className="p-1 rounded-md bg-sky-100/50 dark:bg-sky-900/30 text-sky-600 dark:text-sky-400">
                                                <MessageSquare className="h-4 w-4" />
                                            </div>
                                            <span className="font-medium">Messages</span>
                                        </div>
                                        {unreadCountForMember > 0 && (
                                            <span className="flex items-center justify-center min-w-[1.25rem] h-5 px-1.5 rounded-full bg-red-500 text-[10px] font-bold text-white shadow-sm">
                                                {unreadCountForMember > 9 ? '9+' : unreadCountForMember}
                                            </span>
                                        )}
                                    </Link>
                                </DropdownMenuItem>

                                <DropdownMenuSeparator className="my-1 bg-slate-100 dark:bg-slate-800" />

                                <DropdownMenuItem asChild>
                                    <Link
                                        href="/members/schedule"
                                        className="flex items-center gap-2.5 cursor-pointer p-2.5 rounded-lg text-slate-600 dark:text-slate-300 focus:text-indigo-600 dark:focus:text-indigo-400 focus:bg-indigo-50 dark:focus:bg-indigo-950/30 transition-all duration-200"
                                    >
                                        <div className="p-1 rounded-md bg-violet-100/50 dark:bg-violet-900/30 text-violet-600 dark:text-violet-400">
                                            <Calendar className="h-4 w-4" />
                                        </div>
                                        <span className="font-medium">Shift Schedule</span>
                                    </Link>
                                </DropdownMenuItem>

                                <DropdownMenuItem asChild>
                                    <Link
                                        href="/members"
                                        className="flex items-center gap-2.5 cursor-pointer p-2.5 rounded-lg text-slate-600 dark:text-slate-300 focus:text-indigo-600 dark:focus:text-indigo-400 focus:bg-indigo-50 dark:focus:bg-indigo-950/30 transition-all duration-200"
                                    >
                                        <div className="p-1 rounded-md bg-emerald-100/50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400">
                                            <CheckSquare className="h-4 w-4" />
                                        </div>
                                        <span className="font-medium">My Tasks</span>
                                    </Link>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    )}
                    {user?.role === 'STUDENT' && (
                        <Link href="/student/myService" className="relative text-sm font-medium text-indigo-600 dark:text-indigo-400 group">
                            My Services
                            <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-indigo-600 origin-left transform scale-x-0 transition-transform duration-300 group-hover:scale-x-100" />
                        </Link>
                    )}
                    <Link href="/" className="relative text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-indigo-600 transition-colors group">
                        Home
                        <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-indigo-600 origin-left transform scale-x-0 transition-transform duration-300 group-hover:scale-x-100" />
                    </Link>
                    <Link href="/guides" className="relative text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-indigo-600 transition-colors group">
                        Guides
                        <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-indigo-600 origin-left transform scale-x-0 transition-transform duration-300 group-hover:scale-x-100" />
                    </Link>
                    <Link href="/services" className="relative text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-indigo-600 transition-colors group">
                        Services
                        <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-indigo-600 origin-left transform scale-x-0 transition-transform duration-300 group-hover:scale-x-100" />
                    </Link>
                    <Link href="/about" className="relative text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-indigo-600 transition-colors group">
                        About
                        <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-indigo-600 origin-left transform scale-x-0 transition-transform duration-300 group-hover:scale-x-100" />
                    </Link>
                    <Link href="/blogs" className="relative text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-indigo-600 transition-colors group">
                        Blogs
                        <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-indigo-600 origin-left transform scale-x-0 transition-transform duration-300 group-hover:scale-x-100" />
                    </Link>
                </div>

                {/* Right Side Tools */}
                <div className="flex items-center gap-2">
                    {user ? (
                        <div className="flex items-center gap-3">

                            {/* 4. Real-time Notification Dropdown */}
                            {user.role === 'STUDENT' && (
                                <DropdownMenu onOpenChange={(open) => {
                                    if (open) markAllAsRead();
                                }}>
                                    <DropdownMenuTrigger asChild>
                                        <button
                                            type="button"
                                            className="relative p-2 rounded-full text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all outline-none"
                                        >
                                            <Bell className="h-5 w-5" />
                                            {unreadCount > 0 && (
                                                <span className="absolute top-1.5 right-1.5 flex h-4 w-4">
                                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                                                    <span className="relative inline-flex rounded-full h-4 w-4 bg-red-500 text-[10px] text-white font-bold items-center justify-center">
                                                        {unreadCount > 9 ? "9+" : unreadCount}
                                                    </span>
                                                </span>
                                            )}
                                        </button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end" className="w-80 sm:w-96 p-0 rounded-xl shadow-2xl border-slate-200 dark:border-slate-800 overflow-hidden bg-white/95 dark:bg-slate-950/95 backdrop-blur-md">
                                        <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                                            <h3 className="font-semibold text-slate-900 dark:text-slate-100">Notifications</h3>

                                        </div>

                                        <div className="max-h-[400px] overflow-y-auto custom-scrollbar">
                                            {notifications.length === 0 ? (
                                                <div className="p-8 text-center text-slate-500 dark:text-slate-400">
                                                    <Bell className="h-12 w-12 mx-auto mb-3 opacity-20" />
                                                    <p className="text-sm">No notifications yet</p>
                                                </div>
                                            ) : (
                                                <div className="divide-y divide-slate-100 dark:divide-slate-800">
                                                    {notifications.map((notification) => (
                                                        <div
                                                            key={notification.id}
                                                            className={`p-4 transition-colors hover:bg-slate-50 dark:hover:bg-slate-900/50 ${!notification.isRead ? 'bg-indigo-50/50 dark:bg-indigo-950/10' : ''}`}
                                                        >
                                                            <div className="flex gap-3">
                                                                <div className={`mt-1 h-2 w-2 rounded-full flex-shrink-0 ${!notification.isRead ? 'bg-indigo-500' : 'bg-slate-300 dark:bg-slate-700'}`} />
                                                                <div className="flex-1 space-y-1">
                                                                    <p className={`text-sm leading-snug ${!notification.isRead ? 'text-slate-900 dark:text-slate-100 font-medium' : 'text-slate-600 dark:text-slate-400'}`}>
                                                                        {notification.message}
                                                                    </p>
                                                                    <p className="text-xs text-slate-400 dark:text-slate-500">
                                                                        {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
                                                                    </p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>

                                        <div className="p-2 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/30">
                                            <DropdownMenuItem asChild>
                                                <Link href="/student/notification" className="w-full cursor-pointer">
                                                    <Button variant="ghost" className="w-full text-xs h-8 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200">
                                                        View all history
                                                    </Button>
                                                </Link>
                                            </DropdownMenuItem>
                                        </div>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            )}

                            {/* User Dropdown */}
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" className="relative h-10 flex items-center px-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-all">
                                        {user.profileImage ? (
                                            <img src={user.profileImage} alt="Avatar" className="h-8 w-8 rounded-full object-cover border border-slate-200 dark:border-slate-700" />
                                        ) : (
                                            <div className="h-8 w-8 rounded-full bg-indigo-600 flex items-center justify-center text-white text-xs font-bold">
                                                {user.name?.charAt(0).toUpperCase()}
                                            </div>
                                        )}
                                        <div className="hidden lg:flex flex-col items-start leading-none text-left">
                                            <span className="text-sm font-semibold truncate max-w-[100px]">{user.name}</span>
                                            <span className="text-[10px] text-slate-500 uppercase font-bold tracking-tighter">{user.role}</span>
                                        </div>
                                        <ChevronDown className="h-4 w-4 text-slate-400" />
                                    </Button>
                                </DropdownMenuTrigger>

                                <DropdownMenuContent align="end" className="w-56 mt-2 p-2 rounded-xl shadow-xl border-slate-200 dark:border-slate-800">
                                    <DropdownMenuItem asChild>
                                        <Link href="/settings/profile" className="flex items-center gap-2 cursor-pointer p-2 rounded-lg">
                                            <Settings className="h-4 w-4 text-slate-500" />
                                            <span>Your Account</span>
                                        </Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />

                                    <DropdownMenuItem
                                        onClick={() => logout()}
                                        className="flex items-center gap-2 cursor-pointer p-2 rounded-lg text-red-600 focus:bg-red-50 dark:focus:bg-red-950/30"
                                    >
                                        <LogOut className="h-4 w-4" />
                                        <span>Sign out</span>
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    ) : (
                        <Link href="/login">
                            <Button className="bg-indigo-600 hover:bg-indigo-700 rounded-xl px-6">
                                Login
                            </Button>
                        </Link>
                    )}

                    <MobileNav user={user || undefined} />
                </div>
            </div>
        </nav>
    );
}