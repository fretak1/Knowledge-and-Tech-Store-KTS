"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { Terminal as TerminalIcon, Cpu, Globe, ShieldCheck } from "lucide-react";

const TypingText = ({ text }: { text: string }) => {
    const [displayedText, setDisplayedText] = useState("");
    const [index, setIndex] = useState(0);
    const [key, setKey] = useState(0);

    useEffect(() => {
        if (index < text.length) {
            const timeout = setTimeout(() => {
                setDisplayedText((prev) => prev + text[index]);
                setIndex((prev) => prev + 1);
            }, 30);
            return () => clearTimeout(timeout);
        } else {
            // Once finished, wait for the remainder of the 15s interval to restart
            const restartTimeout = setTimeout(() => {
                setDisplayedText("");
                setIndex(0);
                setKey(prev => prev + 1);
            }, 10000); // Wait 10s after finishing before restarting
            return () => clearTimeout(restartTimeout);
        }
    }, [index, text, key]);

    return (
        <p className="text-lg md:text-2xl text-slate-300 mb-6 md:mb-10 leading-relaxed max-w-2xl min-h-[140px] md:min-h-[120px]">
            {displayedText}
            <motion.span
                animate={{ opacity: [0, 1, 0] }}
                transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
                className="inline-block w-1 h-6 ml-1 bg-indigo-500 align-middle"
            />
        </p>
    );
};

const Terminal = () => {
    const [logs, setLogs] = useState<string[]>([]);
    const [key, setKey] = useState(0);
    const allLogs = [
        "> Initializing KTS Core...",
        "> Establishing secure connection...",
        "> Loading student resources...",
        "> System check: All modules green.",
        "> Ready to assist."
    ];

    useEffect(() => {
        let currentLog = 0;
        const interval = setInterval(() => {
            if (currentLog < allLogs.length) {
                setLogs(prev => [...prev, allLogs[currentLog]]);
                currentLog++;
            } else {
                clearInterval(interval);
                // Restart after a delay
                setTimeout(() => {
                    setLogs([]);
                    setKey(prev => prev + 1);
                }, 7500); // Wait 7.5s after finishing before restarting
            }
        }, 1500);
        return () => clearInterval(interval);
    }, [key]);

    return (
        <div className="w-full max-w-md bg-slate-900/80 backdrop-blur-xl border border-slate-700/50 rounded-xl overflow-hidden shadow-2xl">
            <div className="flex items-center justify-between px-4 py-2 bg-slate-800/50 border-b border-slate-700/50">
                <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-red-500/50" />
                    <div className="w-3 h-3 rounded-full bg-amber-500/50" />
                    <div className="w-3 h-3 rounded-full bg-emerald-500/50" />
                </div>
                <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
                    <TerminalIcon size={12} />
                    <span>kts-terminal — bash</span>
                </div>
            </div>
            <div className="p-4 font-mono text-sm space-y-2 min-h-[160px]">
                <AnimatePresence mode="popLayout">
                    {logs.map((log, i) => (
                        <motion.div
                            key={`${key}-${i}`}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 10 }}
                            className={i === logs.length - 1 ? "text-emerald-400" : "text-slate-400"}
                        >
                            {log}
                        </motion.div>
                    ))}
                </AnimatePresence>
                <div className="flex items-center gap-2 text-indigo-400">
                    <span>$</span>
                    <motion.div
                        animate={{ opacity: [0, 1, 0] }}
                        transition={{ duration: 0.8, repeat: Infinity }}
                        className="w-2 h-4 bg-indigo-500"
                    />
                </div>
            </div>
            <div className="grid grid-cols-3 border-t border-slate-700/50 bg-slate-800/30">
                <div className="flex flex-col items-center py-3 border-r border-slate-700/50">
                    <Cpu size={16} className="text-indigo-400 mb-1" />
                    <span className="text-[10px] uppercase tracking-wider text-slate-500">CPU</span>
                    <span className="text-xs font-semibold text-slate-300">Optimized</span>
                </div>
                <div className="flex flex-col items-center py-3 border-r border-slate-700/50">
                    <Globe size={16} className="text-emerald-400 mb-1" />
                    <span className="text-[10px] uppercase tracking-wider text-slate-500">Network</span>
                    <span className="text-xs font-semibold text-slate-300">Global</span>
                </div>
                <div className="flex flex-col items-center py-3">
                    <ShieldCheck size={16} className="text-amber-400 mb-1" />
                    <span className="text-[10px] uppercase tracking-wider text-slate-500">Security</span>
                    <span className="text-xs font-semibold text-slate-300">Verified</span>
                </div>
            </div>
        </div>
    );
};

export default function HeroSection() {
    const heroDescription = "Empowering students with reliable, affordable tech support and solutions. We believe every student deserves access to quality technology services that keep them connected and productive.";

    return (
        <section className="relative min-h-screen flex items-center overflow-hidden bg-slate-950 text-white">
            {/* Background Effects */}
            <div className="absolute inset-0 z-0">
                {/* Gradient Mesh */}
                <div className="absolute top-[-20%] right-[-10%] w-[800px] h-[800px] bg-indigo-600/30 rounded-full blur-[120px] animate-pulse" />
                <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] bg-blue-600/20 rounded-full blur-[100px]" />

                {/* Tech Grid Overlay */}
                <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:50px_50px] [mask-image:radial-gradient(ellipse_at_center,black_40%,transparent_80%)]" />
            </div>

            <div className="container mx-auto px-6 relative z-10 grid md:grid-cols-2 gap-12 items-center">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="flex flex-col items-center md:items-start text-center md:text-left max-w-3xl"
                >
                    <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-indigo-100 to-indigo-300">
                        Knowledge & Tech Store
                    </h1>

                    <TypingText text={heroDescription} />

                    <div className="flex flex-col sm:flex-row gap-5 w-full sm:w-auto">
                        <Link href="/services" className="w-full sm:w-auto">
                            <Button size="lg" className="w-full sm:w-auto text-lg h-14 px-8 bg-indigo-600 hover:bg-indigo-700 shadow-[0_0_20px_rgba(79,70,229,0.5)] hover:shadow-[0_0_30px_rgba(79,70,229,0.7)] transition-all duration-300">
                                Explore Services
                            </Button>
                        </Link>
                        <Link href="/about" className="w-full sm:w-auto">
                            <Button
                                size="lg"
                                variant="outline"
                                className="w-full sm:w-auto h-14 px-8 text-lg bg-white text-black border-slate-700 transition-all duration-300 
             hover:bg-white hover:border-indigo-500 
             hover:shadow-[0_0_15px_rgba(99,102,241,0.4)] 
             hover:ring-1 hover:ring-indigo-500/20"
                            >                          About Us
                            </Button>
                        </Link>
                    </div>
                </motion.div>

                {/* Right side illustration area */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 1, delay: 0.2 }}
                    className="hidden md:flex justify-center items-center h-full"
                >
                    <div className="relative w-full aspect-square max-w-[500px] flex items-center justify-center">
                        <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500/20 to-purple-500/20 rounded-full animate-blob mix-blend-multiply filter blur-xl opacity-70"></div>
                        <div className="absolute top-0 -right-4 w-72 h-72 bg-purple-500/20 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
                        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-indigo-500/20 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>

                        {/* Modern Terminal Feature */}
                        <Terminal />
                    </div>
                </motion.div>
            </div>
        </section>
    );
}

