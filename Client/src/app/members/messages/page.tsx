"use client";

import { useEffect } from "react";
import { MessageSquare, Clock, User } from "lucide-react";
import { useMessageStore } from "@/store/useMessageStore";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";

export default function AdminMessagesPage() {
    const { messages, getMessages, markAllAsRead, isLoading } = useMessageStore();

    useEffect(() => {
        getMessages();
    }, [getMessages]);

    useEffect(() => {
        markAllAsRead();
    }, [markAllAsRead]);

    return (
        <div className="min-h-screen bg-slate-50/50 dark:bg-slate-950 pb-20">
            {/* Header Section */}
            <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 py-12 mb-8">
                <div className="container mx-auto px-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <h1 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
                            Community <span className="text-indigo-900">Feedback</span>
                        </h1>
                        <p className="text-slate-500 dark:text-slate-400 mt-1">
                            Review latest messages and inquiries.
                        </p>
                    </div>
                    <Badge variant="secondary" className="px-4 py-1.5 rounded-full bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 border-none font-bold">
                        {messages.length} Total Messages
                    </Badge>
                </div>
            </header>

            <div className="container mx-auto px-6 max-w-5xl">
                {/* Empty State */}
                {messages.length === 0 && !isLoading && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-center py-24 bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-sm"
                    >
                        <div className="w-16 h-16 bg-slate-50 dark:bg-slate-800 rounded-2xl flex items-center justify-center mx-auto mb-4">
                            <MessageSquare className="h-8 w-8 text-slate-300" />
                        </div>
                        <h3 className="text-xl font-bold text-slate-900 dark:text-white">Inbox is clear</h3>
                        <p className="text-slate-500 dark:text-slate-400 mt-1">No new messages at the moment.</p>
                    </motion.div>
                )}

                {/* Message List */}
                <div className="grid grid-cols-1 gap-4">
                    {messages.map((msg, index) => (
                        <motion.div
                            key={msg.id}
                            initial={{ opacity: 0, y: 15 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                            className="group relative bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[2rem] p-6 hover:shadow-2xl hover:shadow-indigo-500/10 hover:border-indigo-500/20 transition-all duration-300"
                        >
                            <div className="flex items-start gap-5">
                                {/* Modern Minimal Avatar */}
                                <div className="hidden sm:flex w-12 h-12 rounded-2xl bg-indigo-900 text-white items-center justify-center font-black shrink-0 shadow-lg shadow-slate-200 dark:shadow-none">
                                    {msg.name.charAt(0).toUpperCase()}
                                </div>

                                <div className="flex-1 min-w-0 overflow-hidden">
                                    <div className="flex items-center justify-between mb-2">
                                        <h3 className="font-bold text-slate-900 dark:text-white text-lg truncate">
                                            {msg.name}
                                        </h3>
                                        <div className="flex items-center text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest bg-slate-50 dark:bg-slate-800/50 px-2.5 py-1 rounded-lg">
                                            <Clock className="w-3 h-3 mr-1.5" />
                                            {msg.createdAt ? new Date(msg.createdAt).toLocaleDateString() : "Recent"}
                                        </div>
                                    </div>

                                    {/* Message with Strict Overflow Handling */}
                                    <div className="relative">
                                        <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-base whitespace-pre-wrap break-words line-clamp-2 group-hover:line-clamp-none transition-all duration-500 ease-in-out">
                                            {msg.message}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
}