"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuthStore } from '@/store/useAuthStore';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, ShieldCheck, Lock, Loader2, ArrowRight, ArrowLeft } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

export default function ForgotPasswordForm() {
    const router = useRouter();
    const { sendResetCode, verifyResetCode, resetPassword, isLoading } = useAuthStore();

    const [step, setStep] = useState<1 | 2 | 3>(1);
    const [email, setEmail] = useState("");
    const [code, setCode] = useState("");
    const [newPassword, setNewPassword] = useState("");

    const handleSendCode = async () => {
        if (!email) return toast.error("Please enter your email");
        const success = await sendResetCode(email);
        if (success) {
            toast.success("Reset code sent to your email");
            setStep(2);
        } else {
            toast.error("Failed to send reset code. Email might not exist.");
        }
    };

    const handleVerifyCode = async () => {
        if (!code) return toast.error("Please enter verification code");
        const success = await verifyResetCode(email, code);
        if (success) {
            toast.success("Code verified");
            setStep(3);
        } else {
            toast.error("Invalid verification code");
        }
    };

    const handleResetPassword = async () => {
        if (!newPassword || newPassword.length < 6) {
            return toast.error("Password must be at least 6 characters");
        }
        const success = await resetPassword(email, code, newPassword);
        if (success) {
            toast.success("Password reset successfully! Please login.");
            router.push("/login");
        } else {
            toast.error("Failed to reset password");
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full max-w-md"
        >
            <Card className="w-full overflow-hidden border-t-4 border-t-indigo-600 shadow-xl">
                <CardHeader className="space-y-1 text-center pb-2">
                    <CardTitle className="text-2xl font-bold tracking-tight text-slate-900">
                        {step === 1 ? "Forgot Password" : step === 2 ? "Verify Email" : "Reset Password"}
                    </CardTitle>
                    <CardDescription className="text-slate-500">
                        {step === 1
                            ? "Enter your email to receive a 6-digit code"
                            : step === 2
                                ? `Verify the code sent to ${email}`
                                : "Set a new password for your account"}
                    </CardDescription>
                </CardHeader>

                <CardContent className="grid gap-5 pt-4">
                    <AnimatePresence mode="wait">
                        {step === 1 && (
                            <motion.div
                                key="step1"
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                                className="grid gap-4"
                            >
                                <div className="grid gap-2">
                                    <Label htmlFor="email">Email</Label>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                                        <Input
                                            id="email"
                                            placeholder="Enter your email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            className="pl-10"
                                        />
                                    </div>
                                </div>
                                <Button
                                    className="w-full bg-indigo-600 hover:bg-indigo-700"
                                    onClick={handleSendCode}
                                    loading={isLoading}
                                >
                                    Send Code
                                    <ArrowRight className="ml-2 h-4 w-4" />
                                </Button>
                            </motion.div>
                        )}

                        {step === 2 && (
                            <motion.div
                                key="step2"
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                                className="grid gap-4"
                            >
                                <div className="grid gap-2">
                                    <Label htmlFor="code">6-Digit Code</Label>
                                    <div className="relative">
                                        <ShieldCheck className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                                        <Input
                                            id="code"
                                            placeholder="Enter your code"
                                            maxLength={6}
                                            value={code}
                                            onChange={(e) => setCode(e.target.value)}
                                            className="pl-10 tracking-[0.5em] font-mono text-center"
                                        />
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <Button
                                        className="flex-1 bg-indigo-600 hover:bg-indigo-700"
                                        onClick={handleVerifyCode}
                                        loading={isLoading}
                                    >
                                        Verify Code
                                    </Button>
                                    <Button
                                        variant="outline"
                                        onClick={handleSendCode}
                                        disabled={isLoading}
                                    >
                                        Resend
                                    </Button>
                                </div>
                            </motion.div>
                        )}

                        {step === 3 && (
                            <motion.div
                                key="step3"
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                                className="grid gap-4"
                            >
                                <div className="grid gap-2">
                                    <Label htmlFor="newPassword">New Password</Label>
                                    <div className="relative">
                                        <Lock className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                                        <Input
                                            id="newPassword"
                                            type="password"
                                            placeholder="••••••••"
                                            value={newPassword}
                                            onChange={(e) => setNewPassword(e.target.value)}
                                            className="pl-10"
                                        />
                                    </div>
                                </div>
                                <Button
                                    className="w-full bg-indigo-600 hover:bg-indigo-700"
                                    onClick={handleResetPassword}
                                    loading={isLoading}
                                >
                                    Reset Password
                                </Button>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </CardContent>

                <CardFooter className="flex justify-center border-t py-4 bg-gray-50/50">
                    <Link
                        href="/login"
                        className="flex items-center text-sm text-indigo-600 hover:underline"
                    >
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Back to Login
                    </Link>
                </CardFooter>
            </Card>
        </motion.div>
    );
}
