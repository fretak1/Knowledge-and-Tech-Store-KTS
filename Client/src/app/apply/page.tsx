"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useApplicationStore } from "@/store/useApplicationStore";
import { toast } from "sonner";
import { useAuthStore } from "@/store/useAuthStore";
import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Send, Lock } from "lucide-react";

interface ApplicationFormValues {
    name: string;
    email: string;
    phone: string;
    department: string;
    batch: string;
    reason: string;
}

export default function StudentApplicationPage() {
    const { isOpen, isLoading, error, fetch, submitApplication } = useApplicationStore();
    const { user } = useAuthStore();

    const form = useForm<ApplicationFormValues>({
        defaultValues: {
            name: "",
            email: "",
            phone: "",
            department: "",
            batch: "",
            reason: "",
        },
    });

    useEffect(() => {
        fetch();
        if (user) {
            form.reset({
                name: user.name || "",
                email: user.email || "",
                phone: user.phone || "",
                department: user.department || "",
                batch: user.batch || "",
                reason: "",
            });
        }
    }, [fetch, user, form]);

    const onSubmit = async (data: ApplicationFormValues) => {
        const success = await submitApplication(data);
        if (success) {
            toast.success("Application submitted successfully!");
            form.reset();
        } else {
            toast.error("Failed to submit application. Please try again.");
        }
    };

    if (!isOpen && !isLoading) {
        return (
            <div className="container mx-auto py-20 px-4 flex flex-col items-center justify-center text-center">
                <div className="p-6 rounded-full bg-slate-100 dark:bg-slate-800 mb-6">
                    <Lock className="h-12 w-12 text-slate-400" />
                </div>
                <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">Applications Closed</h1>
                <p className="text-slate-600 dark:text-slate-400 max-w-md">
                    Membership applications are currently closed. Please check back later or follow our announcements for the next intake window.
                </p>
            </div>
        );
    }

    return (
        <div className="container mx-auto py-10 px-4 max-w-2xl">
            <Card className="border-indigo-100 dark:border-indigo-900 shadow-xl">
                <CardHeader className="bg-indigo-50/50 dark:bg-indigo-950/20 border-b border-indigo-100 dark:border-indigo-900/50">
                    <CardTitle className="text-2xl text-indigo-700 dark:text-indigo-300">Membership Application</CardTitle>
                    <CardDescription>
                        Apply to become a member of KTS. Please fill out the details accurately.
                    </CardDescription>
                </CardHeader>
                <CardContent className="pt-6">
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">

                            <div className="grid gap-4 md:grid-cols-2">
                                <FormField
                                    control={form.control}
                                    name="name"
                                    rules={{
                                        required: "Name is required",
                                        minLength: { value: 2, message: "Name must be at least 2 characters" }
                                    }}
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Full Name</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Enter your full name" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="email"
                                    rules={{
                                        required: "Email is required",
                                        pattern: {
                                            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                            message: "Invalid email address"
                                        }
                                    }}
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Email</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Enter your email" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <div className="grid gap-4 md:grid-cols-2">
                                <FormField
                                    control={form.control}
                                    name="department"
                                    rules={{ required: "Department is required" }}
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Department</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Enter your department" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="batch"
                                    rules={{ required: "Batch is required" }}
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Batch</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Enter your batch" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <FormField
                                control={form.control}
                                name="phone"
                                rules={{
                                    required: "Phone number is required",
                                    minLength: { value: 10, message: "Phone number must be at least 10 characters" }
                                }}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Phone Number</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Enter your phone number" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="reason"
                                rules={{
                                    required: "Reason is required",
                                    minLength: { value: 20, message: "Please provide a detailed reason (min 20 chars)" }
                                }}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Why do you want to join KTS?</FormLabel>
                                        <FormControl>
                                            <Textarea
                                                placeholder="Tell us about your motivation, skills, and what you hope to achieve..."
                                                className="min-h-[120px]"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormDescription>
                                            Please be descriptive. This helps us evaluate your application.
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <Button
                                type="submit"
                                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white"
                                disabled={isLoading}
                            >
                                {isLoading ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Submitting...
                                    </>
                                ) : (
                                    <>
                                        <Send className="mr-2 h-4 w-4" />
                                        Submit Application
                                    </>
                                )}
                            </Button>
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </div>
    );
}
