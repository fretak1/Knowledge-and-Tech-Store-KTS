"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Facebook, Send, Mail, MessageCircle, ArrowRight, Sparkles } from "lucide-react";
import { useMessageStore } from "@/store/useMessageStore";
import { useAuthStore } from "@/store/useAuthStore";
import { toast } from "sonner";

export default function Footer() {
    const [formData, setFormData] = useState({
        name: "",
        message: "",
    });

    const { sendMessages, isLoading, error } = useMessageStore();
    const { user } = useAuthStore();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const res = await sendMessages(formData.name, formData.message);

        if (res) {
            toast.success("Message sent successfully");
            setFormData({ name: "", message: "" });
        } else {
            toast.error("Failed to send message");
        }

    };

    const quickLinks = [
        { name: "Home", href: "/" },
        { name: "Services", href: "/services" },
        { name: "Guides", href: "/guides" },
        { name: "About", href: "/about" },
    ];

    const socialLinks = [
        { name: "Facebook", icon: Facebook, href: "#", color: "hover:text-blue-500" },
        { name: "Telegram", icon: Send, href: "#", color: "hover:text-sky-500" },
        { name: "Email", icon: Mail, href: "#", color: "hover:text-indigo-500" },
    ];

    return (
        <footer className="relative bg-gradient-to-b from-white to-slate-50 dark:from-slate-950 dark:to-slate-900 border-t border-slate-100 dark:border-slate-800 overflow-hidden">
            {/* Decorative Background */}
            <div className="absolute inset-0 bg-grid-slate-100 dark:bg-grid-slate-800/20 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] dark:[mask-image:linear-gradient(0deg,rgba(0,0,0,0.8),rgba(0,0,0,0.4))]" />
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-500/5 dark:bg-indigo-500/10 rounded-full blur-3xl" />
            <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/5 dark:bg-purple-500/10 rounded-full blur-3xl" />

            <div className="relative container mx-auto px-6 py-12">
                {/* Main Grid */}
                <div className={`grid grid-cols-1 md:grid-cols-2 ${user?.role !== "MEMBER" && user?.role !== "ADMIN" ? "lg:grid-cols-4" : "lg:grid-cols-2"} gap-10 mb-12`}>
                    {/* KTS Info */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-2">
                            <div className="h-10 w-10 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center">
                                <Sparkles className="w-5 h-5 text-white" />
                            </div>
                            <h3 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">KTS</h3>
                        </div>
                        <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed max-w-md">
                            Knowledge & Tech Store — empowering students with campus IT services, hardware repair, and software installation.
                        </p>

                        {/* Social Links */}
                        <div className="flex gap-3">
                            {socialLinks.map((social) => (
                                <a
                                    key={social.name}
                                    href={social.href}
                                    className={`h-10 w-10 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl flex items-center justify-center text-slate-600 dark:text-slate-400 ${social.color} transition-all hover:scale-110 hover:shadow-lg`}
                                    aria-label={social.name}
                                >
                                    <social.icon className="w-4 h-4" />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div className={`space-y-4 ${user?.role === "MEMBER" || user?.role === "ADMIN" ? "md:justify-self-end mr-12" : ""}`}>
                        <h4 className="text-lg font-bold text-slate-900 dark:text-white">Quick Links</h4>
                        <ul className="space-y-2.5">
                            {quickLinks.map((link) => (
                                <li key={link.name}>
                                    <Link
                                        href={link.href}
                                        className="group flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                                    >
                                        <ArrowRight className="w-3 h-3 opacity-0 -ml-5 group-hover:opacity-100 group-hover:ml-0 transition-all" />
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact Form - Hidden for MEMBER and ADMIN roles */}
                    {user?.role !== "MEMBER" && user?.role !== "ADMIN" && (
                        <div className="lg:col-span-2">
                            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-xl">
                                <div className="flex items-center gap-2 mb-4">
                                    <MessageCircle className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                                    <h4 className="font-bold text-lg text-slate-900 dark:text-white">
                                        Send us a message
                                    </h4>
                                </div>

                                <form onSubmit={handleSubmit} className="space-y-3">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                        <Input
                                            placeholder="Your name"
                                            value={formData.name}
                                            onChange={(e) =>
                                                setFormData({ ...formData, name: e.target.value })
                                            }
                                            required
                                            disabled={isLoading}
                                            className="h-11 rounded-xl border-slate-200 dark:border-slate-700 focus:border-indigo-500 dark:focus:border-indigo-500"
                                        />
                                    </div>

                                    <Textarea
                                        placeholder="Your message..."
                                        rows={3}
                                        value={formData.message}
                                        onChange={(e) =>
                                            setFormData({ ...formData, message: e.target.value })
                                        }
                                        required
                                        disabled={isLoading}
                                        className="rounded-xl border-slate-200 dark:border-slate-700 focus:border-indigo-500 dark:focus:border-indigo-500 resize-none"
                                    />

                                    <Button
                                        type="submit"
                                        className="w-full h-11 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-xl font-bold shadow-lg shadow-indigo-500/20 transition-all hover:scale-[1.02] active:scale-95"
                                        disabled={isLoading}
                                    >
                                        {isLoading ? (
                                            <span className="flex items-center gap-2">
                                                <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                                Sending...
                                            </span>
                                        ) : (
                                            <span className="flex items-center gap-2">
                                                <Send className="w-4 h-4" />
                                                Send Message
                                            </span>
                                        )}
                                    </Button>
                                </form>
                            </div>
                        </div>
                    )}
                </div>

                {/* Bottom Bar */}
                <div className="pt-6 border-t border-slate-200 dark:border-slate-800">
                    <p className="text-sm text-slate-600 dark:text-slate-400 text-center">
                        © {new Date().getFullYear()} Knowledge & Tech Store. All rights reserved.
                    </p>
                </div>
            </div>
        </footer>
    );
}
