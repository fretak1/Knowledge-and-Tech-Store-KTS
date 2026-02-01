"use client";

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { services, iconMap } from '@/data/services';
import { ArrowRight, CheckCircle2, CircleDollarSign, Download, LifeBuoy, MapPin, NotebookPen } from 'lucide-react';

export default function ServicesPage() {
    const [selectedCategory, setSelectedCategory] = useState<string>('all');

    // Get unique categories
    const categories = ['all', ...Array.from(new Set(services.map(s => s.category)))];

    // Filter services by category
    const filteredServices = selectedCategory === 'all'
        ? services
        : services.filter(s => s.category === selectedCategory);

    return (
        <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-slate-950">
            {/* Hero Section */}
            <section className="relative overflow-hidden bg-white dark:bg-slate-900 pt-32 pb-20 border-b border-slate-200 dark:border-slate-800">
                <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none -z-10">
                    <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-500/10 rounded-full blur-[120px]" />
                    <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-500/10 rounded-full blur-[120px]" />
                </div>

                <div className="container mx-auto px-4 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6 py-2 bg-clip-text text-transparent bg-indigo-900 dark:from-white dark:via-indigo-200 dark:to-white">
                            IT Services for the Modern Campus
                        </h1>
                        <p className="text-lg md:text-xl max-w-2xl mx-auto text-slate-600 dark:text-slate-400 leading-relaxed">
                            From quick repairs to complex software setups, we provide comprehensive tech support
                            tailored specifically for the student and campus environment.
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Category Filter */}
            <section className=" top-16 z-30 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 py-4">
                <div className="container mx-auto px-4">
                    <div className="flex items-center justify-center gap-2 overflow-x-auto no-scrollbar pb-1">
                        {categories.map((category) => (
                            <Button
                                key={category}
                                variant={selectedCategory === category ? "default" : "ghost"}
                                onClick={() => setSelectedCategory(category)}
                                className={`capitalize rounded-full px-6 whitespace-nowrap ${selectedCategory === category
                                    ? "bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-200 dark:shadow-none"
                                    : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                                    }`}
                                size="sm"
                            >
                                {category === 'all' ? 'All Services' : category}
                            </Button>
                        ))}
                    </div>
                </div>
            </section>

            {/* Services Grid */}
            <section className="py-20">
                <div className="container mx-auto px-4">
                    <motion.div
                        layout
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto"
                    >
                        <AnimatePresence mode="popLayout">
                            {filteredServices.map((service) => {
                                const IconComponent = iconMap[service.icon] || LifeBuoy;
                                return (
                                    <motion.div
                                        key={service.id}
                                        layout
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.95 }}
                                        transition={{ duration: 0.3 }}
                                    >
                                        <Card className="group h-full border-slate-200 dark:border-slate-800 hover:border-indigo-300 dark:hover:border-indigo-700 hover:shadow-xl hover:shadow-indigo-500/5 transition-all duration-300 overflow-hidden flex flex-col bg-white dark:bg-slate-900">
                                            <CardHeader className="pb-4">
                                                <div className="flex items-start justify-between mb-4">
                                                    <div className="p-3 bg-indigo-50 dark:bg-indigo-900/30 rounded-2xl group-hover:scale-110 transition-transform duration-300">
                                                        <IconComponent className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
                                                    </div>
                                                    <Badge variant="secondary" className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-medium">
                                                        {service.category}
                                                    </Badge>
                                                </div>
                                                <CardTitle className="text-xl group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                                                    {service.title}
                                                </CardTitle>
                                                <CardDescription className="text-slate-500 dark:text-slate-400 line-clamp-2 mt-2">
                                                    {service.description}
                                                </CardDescription>
                                            </CardHeader>
                                            <CardContent className="flex flex-col flex-1 pt-0">
                                                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed flex-1">
                                                    {service.details}
                                                </p>
                                            </CardContent>
                                        </Card>
                                    </motion.div>
                                );
                            })}
                        </AnimatePresence>
                    </motion.div>
                </div>
            </section>

            {/* Why Choose Us Section */}
            <section className="py-24 bg-gradient-to-r from-slate-900 via-indigo-900 to-slate-900 dark:bg-slate-900 text-white relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                    <div className="absolute top-[20%] right-[-5%] w-[30%] h-[30%] bg-indigo-600/20 rounded-full blur-[100px]" />
                    <div className="absolute bottom-[20%] left-[-5%] w-[30%] h-[30%] bg-blue-600/20 rounded-full blur-[100px]" />
                </div>

                <div className="container mx-auto px-4 relative z-10">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">Why Choose KTS?</h2>
                        <p className="text-slate-400 max-w-2xl mx-auto">
                            We combine expert knowledge with a deep understanding of the student experience.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12 max-w-5xl mx-auto">
                        <div className="flex flex-col items-center text-center group">
                            <div className="mb-6 p-4 bg-white/10 rounded-3xl border border-white/10 group-hover:bg-white/20 transition-colors">
                                <CircleDollarSign className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
                            </div>
                            <h3 className="text-xl font-bold mb-3">Affordable Pricing</h3>
                            <p className="text-slate-400 text-sm leading-relaxed">
                                Student-friendly prices with high-quality service at affordable rates.                            </p>
                        </div>

                        <div className="flex flex-col items-center text-center group">
                            <div className="mb-6 p-4 bg-white/10 rounded-3xl border border-white/10 group-hover:bg-white/20 transition-colors">
                                <Download />
                            </div>
                            <h3 className="text-xl font-bold mb-3">Rapid Turnaround</h3>
                            <p className="text-slate-400 text-sm leading-relaxed">
                                We know your time is valuable. Most repairs and setups are completed within 24-48 hours.
                            </p>
                        </div>

                        <div className="flex flex-col items-center text-center group">
                            <div className="mb-6 p-4 bg-white/10 rounded-3xl border border-white/10 group-hover:bg-white/20 transition-colors">
                                <NotebookPen className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
                            </div>
                            <h3 className="text-xl font-bold mb-3">Student Context</h3>
                            <p className="text-slate-400 text-sm leading-relaxed">
                                Our technicians are students too. We understand your software needs and deadline pressures.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-24 bg-white dark:bg-slate-950">
                <div className="container mx-auto px-4">
                    <motion.div
                        whileInView={{ opacity: 1, y: 0 }}
                        initial={{ opacity: 0, y: 30 }}
                        viewport={{ once: true }}
                        className="max-w-5xl mx-auto bg-gradient-to-r from-slate-900 via-indigo-900 to-slate-900 rounded-[3rem] p-8 md:p-16 text-center text-white relative shadow-2xl shadow-indigo-500/20"
                    >
                        <div className="relative z-10">
                            <h2 className="text-3xl md:text-5xl font-bold mb-6">Need Any Assistance?</h2>
                            <p className="text-indigo-100 text-lg md:text-xl max-w-2xl mx-auto mb-10 opacity-90">
                                Reach out to our team or visit us at the campus tech store.
                                Our experts are ready to solve your technical challenges.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4 items-center justify-center text-center">
                                <MapPin className="text-indigo-400" />
                                <span className="text-indigo-100">Student Union Office, Office 006</span>
                            </div>

                            <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8 text-indigo-200 text-sm font-medium">
                                <div className="flex items-center gap-2">
                                    <CheckCircle2 className="w-4 h-4 text-indigo-400" />
                                    No Appointment Needed
                                </div>
                                <div className="flex items-center gap-2">
                                    <CheckCircle2 className="w-4 h-4 text-indigo-400" />
                                    24/7 Day Support
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>
        </div>
    );
}
