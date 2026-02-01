"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuthStore } from '@/store/useAuthStore';
import { FormEvent } from 'react';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, User, Loader2, ArrowRight, CheckCircle, XCircle } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

export default function SignupForm() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: ""
    });
    const { register, isLoading } = useAuthStore();
    const [focusedField, setFocusedField] = useState<string | null>(null);
    const [passwordStrength, setPasswordStrength] = useState(0);

    useEffect(() => {
        const pass = formData.password;
        let score = 0;
        if (pass.length > 5) score += 25;
        if (pass.length > 8) score += 25;
        if (/[A-Z]/.test(pass)) score += 25;
        if (/[0-9!@#$%^&*]/.test(pass)) score += 25;
        setPasswordStrength(score);
    }, [formData.password]);

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();

        if (formData.password !== formData.confirmPassword) {
            toast.error("Passwords do not match");
            return;
        }

        if (passwordStrength < 50) {
            toast.error("Password is too weak");
            return;
        }

        const userID = await register(
            formData.name,
            formData.email,
            formData.password
        );
        console.log(userID);

        if (userID) {
            toast.success("Account created successfully! Please sign in.");
            router.push("/login");
        } else {
            toast.error("Registration failed. Please try again.");
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
                    <Link
                        href="/login"
                        className="flex-1 py-4 text-center text-sm font-medium text-gray-500 hover:text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                        Login
                    </Link>
                    <div className="flex-1 py-4 text-center text-sm font-medium text-blue-600 border-b-2 border-blue-600 bg-blue-50/50">
                        Register
                    </div>
                </div>

                <CardHeader className="space-y-1 text-center pb-2">
                    <CardTitle className="text-2xl font-bold tracking-tight text-slate-900">
                        Join KTS
                    </CardTitle>
                    <CardDescription className="text-slate-500">
                        Create an account to join KTS
                    </CardDescription>
                </CardHeader>

                <form onSubmit={handleSubmit}>
                    <CardContent className="grid gap-4 pt-4">
                        {/* Name Field */}
                        <div className="grid gap-2 relative">
                            <Label htmlFor="name" className={focusedField === 'name' ? 'text-blue-600' : ''}>Name</Label>
                            <div className="relative">
                                <User className={`absolute left-3 top-2.5 h-4 w-4 transition-colors ${focusedField === 'name' ? 'text-blue-600' : 'text-gray-400'}`} />
                                <Input
                                    id="name"
                                    placeholder="John Doe"
                                    required
                                    className="pl-10 transition-all border-gray-200 focus:border-blue-600 focus:ring-blue-600/20"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    onFocus={() => setFocusedField('name')}
                                    onBlur={() => setFocusedField(null)}
                                />
                            </div>
                        </div>

                        {/* Email Field */}
                        <div className="grid gap-2 relative">
                            <Label htmlFor="email" className={focusedField === 'email' ? 'text-blue-600' : ''}>Email</Label>
                            <div className="relative">
                                <Mail className={`absolute left-3 top-2.5 h-4 w-4 transition-colors ${focusedField === 'email' ? 'text-blue-600' : 'text-gray-400'}`} />
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="student@university.edu"
                                    required
                                    className="pl-10 transition-all border-gray-200 focus:border-blue-600 focus:ring-blue-600/20"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    onFocus={() => setFocusedField('email')}
                                    onBlur={() => setFocusedField(null)}
                                />
                            </div>
                        </div>

                        {/* Password Field */}
                        <div className="grid gap-2 relative">
                            <Label htmlFor="password" className={focusedField === 'password' ? 'text-blue-600' : ''}>Password</Label>
                            <div className="relative">
                                <Lock className={`absolute left-3 top-2.5 h-4 w-4 transition-colors ${focusedField === 'password' ? 'text-blue-600' : 'text-gray-400'}`} />
                                <Input
                                    id="password"
                                    type="password"
                                    required
                                    className="pl-10 transition-all border-gray-200 focus:border-blue-600 focus:ring-blue-600/20"
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    onFocus={() => setFocusedField('password')}
                                    onBlur={() => setFocusedField(null)}
                                />
                            </div>
                            {/* Password Strength Indicator */}
                            {formData.password && (
                                <div className="space-y-1">
                                    <div className="flex justify-between text-xs text-gray-500">
                                        <span>Strength</span>
                                        <span>{passwordStrength < 30 ? 'Weak' : passwordStrength < 70 ? 'Medium' : 'Strong'}</span>
                                    </div>
                                    <div className="h-1 w-full bg-gray-100 rounded-full overflow-hidden">
                                        <div
                                            className={`h-full transition-all duration-300 ${passwordStrength < 30 ? 'bg-red-500' :
                                                passwordStrength < 70 ? 'bg-yellow-500' : 'bg-green-500'
                                                }`}
                                            style={{ width: `${passwordStrength}%` }}
                                        />
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Confirm Password Field */}
                        <div className="grid gap-2 relative">
                            <Label htmlFor="confirmPassword" className={focusedField === 'confirmPassword' ? 'text-blue-600' : ''}>Confirm Password</Label>
                            <div className="relative">
                                <Lock className={`absolute left-3 top-2.5 h-4 w-4 transition-colors ${focusedField === 'confirmPassword' ? 'text-blue-600' : 'text-gray-400'}`} />
                                <Input
                                    id="confirmPassword"
                                    type="password"
                                    required
                                    className={`pl-10 transition-all border-gray-200 focus:border-blue-600 focus:ring-blue-600/20 ${formData.confirmPassword && formData.password !== formData.confirmPassword ? 'border-red-300 focus:border-red-500' : ''}`}
                                    value={formData.confirmPassword}
                                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                                    onFocus={() => setFocusedField('confirmPassword')}
                                    onBlur={() => setFocusedField(null)}
                                />
                            </div>
                        </div>

                    </CardContent>
                    <CardFooter className=" flex flex-col gap-4">
                        <Button
                            className="w-full mt-4 bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-500/30 transition-all duration-200 hover:scale-[1.02]"
                            loading={isLoading}
                        >
                            Create Account <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                    </CardFooter>
                </form>
            </Card>

            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="mt-6 text-center text-sm text-slate-500"
            >
                Already have an account?{' '}
                <Link href="/login" className="font-semibold text-blue-600 hover:text-blue-500 hover:underline underline-offset-4">
                    Sign in here
                </Link>
            </motion.div>
        </motion.div>
    );
}
