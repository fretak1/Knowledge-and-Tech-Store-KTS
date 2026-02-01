"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuthStore } from '@/store/useAuthStore';
import { FormEvent } from 'react';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import { Mail, Lock, Loader2, ArrowRight, ArrowLeft, Eye, EyeOff } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

export default function LoginForm() {
    const router = useRouter();
    const [formData, setFormData] = useState({ email: "", password: "" });
    const { login, isLoading } = useAuthStore();
    const [focusedField, setFocusedField] = useState<string | null>(null);
    const [showPassword, setShowPassword] = useState(false);

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        const success = await login(formData.email, formData.password);
        if (success) {
            toast.success("Welcome back to KTS!");
            router.push("/");
        } else {
            toast.error("Invalid email or password");
        }
    };

    

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full max-w-md"
        >
            <Card className="w-full overflow-hidden border-t-4 border-t-blue-600 shadow-xl">
                {/* Tabbed Interface Header */}
                <div className="flex w-full border-b">
                    <div className="flex-1 py-4 text-center text-sm font-medium text-blue-600 border-b-2 border-blue-600 bg-blue-50/50">
                        Login
                    </div>

                </div>

                <CardHeader className="space-y-1 text-center pb-2">
                    <div className="flex justify-center mb-6">
                        <Link href="/" className="hover:scale-105 transition-transform duration-300">
                            <img
                                src="/logo.png"
                                alt="KTS Logo"
                                className="h-16 w-auto object-contain"
                            />
                        </Link>
                    </div>
                    <CardTitle className="text-2xl font-bold tracking-tight text-slate-900">
                        Welcome Back
                    </CardTitle>
                </CardHeader>

                <form onSubmit={handleSubmit}>
                    <CardContent className="grid gap-5 pt-4">
                        <div className="grid gap-2 relative">
                            <Label htmlFor="email" className={focusedField === 'email' ? 'text-blue-600' : ''}>
                                Email
                            </Label>
                            <div className="relative">
                                <Mail className={`absolute left-3 top-2.5 h-4 w-4 transition-colors ${focusedField === 'email' ? 'text-blue-600' : 'text-gray-400'}`} />
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="Enter your email"
                                    required
                                    className="pl-10 transition-all border-gray-200 focus:border-blue-600 focus:ring-blue-600/20"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    onFocus={() => setFocusedField('email')}
                                    onBlur={() => setFocusedField(null)}
                                />
                            </div>
                        </div>

                        <div className="grid gap-2 relative">
                            <div className="flex items-center justify-between">
                                <Label htmlFor="password" className={focusedField === 'password' ? 'text-blue-600' : ''}>
                                    Password
                                </Label>
                                <Link
                                    href="/forgot-password"
                                    className="text-xs text-blue-600 hover:underline"
                                >
                                    Forgot password?
                                </Link>
                            </div>
                            <div className="relative">
                                <Lock className={`absolute left-3 top-2.5 h-4 w-4 transition-colors ${focusedField === 'password' ? 'text-blue-600' : 'text-gray-400'}`} />
                                <Input
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                    required
                                    className="pl-10 pr-10 transition-all border-gray-200 focus:border-blue-600 focus:ring-blue-600/20"
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    onFocus={() => setFocusedField('password')}
                                    onBlur={() => setFocusedField(null)}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-2.5 text-gray-400 hover:text-blue-600 transition-colors focus:outline-none"
                                >
                                    {showPassword ? (
                                        <EyeOff className="h-4 w-4" />
                                    ) : (
                                        <Eye className="h-4 w-4" />
                                    )}
                                </button>
                            </div>
                        </div>

                        <div className="flex items-center space-x-2">
                            <Link
                                className="mt-2 flex justify-between  text-center text-sm"
                                href="/"
                            >
                                <ArrowLeft className="h-4 w-4 mt-0.5 mr-1" />
                                <p>back to site</p>
                            </Link>
                        </div>
                    </CardContent>

                    <CardFooter>
                        <Button
                            className="w-full mt-4 bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-500/30 transition-all duration-200 hover:scale-[1.02]"
                            loading={isLoading}
                        >
                            Sign In <ArrowRight className="h-4 w-4" />
                        </Button>
                    </CardFooter>
                </form>
            </Card>


        </motion.div>
    );
}
