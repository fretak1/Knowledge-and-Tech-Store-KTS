"use client";

import { useState, useRef, useEffect } from "react";
import { useForm } from "react-hook-form";
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
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Camera, Loader2, Save, Github, Linkedin, Send, GraduationCap } from "lucide-react"; // Added Icons
import { calculateAcademicYear } from "@/lib/utils";

interface ProfileFormValues {
    name: string;
    email: string;
    phone?: string;
    department?: string;
    batch?: string;
    github?: string;
    linkedin?: string;
    telegram?: string;
    currentPassword?: string;
    newPassword?: string;
    confirmPassword?: string;
}

export default function ProfilePage() {
    const { user, updateProfile, isLoading } = useAuthStore();
    const [previewImage, setPreviewImage] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const form = useForm<ProfileFormValues>({
        defaultValues: {
            name: "",
            email: "",
            phone: "",
            department: "",
            batch: "",
            github: "",
            linkedin: "",
            telegram: "",
            currentPassword: "",
            newPassword: "",
            confirmPassword: "",
        },
    });

    // Load user data when available
    useEffect(() => {
        if (user) {
            form.reset({
                name: user.name || "",
                email: user.email || "",
                phone: user.phone || "",
                department: user.department || "",
                batch: user.batch || "",
                github: user.github || "",
                linkedin: user.linkedin || "",
                telegram: user.telegram || "",
            });
            setPreviewImage(user.profileImage);
        }
    }, [user, form]);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewImage(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const onSubmit = async (data: ProfileFormValues) => {
        // Manual Validation
        let hasError = false;

        if (!data.name || data.name.length < 2) {
            form.setError("name", { message: "Name must be at least 2 characters" });
            hasError = true;
        }

        if (!data.email) {
            form.setError("email", { message: "Email is required" });
            hasError = true;
        } else if (!/^\S+@\S+\.\S+$/.test(data.email)) {
            form.setError("email", { message: "Invalid email address" });
            hasError = true;
        }

        if (data.newPassword && data.newPassword.length > 0) {
            if (data.newPassword.length < 6) {
                form.setError("newPassword", { message: "Password must be at least 6 characters" });
                hasError = true;
            }
            if (!data.currentPassword) {
                form.setError("currentPassword", { message: "Current password is required to set a new password" });
                hasError = true;
            }
            if (data.newPassword !== data.confirmPassword) {
                form.setError("confirmPassword", { message: "Passwords do not match" });
                hasError = true;
            }
        }

        if (hasError) return;

        const formData = new FormData();
        formData.append("name", data.name);
        formData.append("email", data.email);
        formData.append("phone", data.phone || "");
        formData.append("department", data.department || "");
        formData.append("batch", data.batch || "");
        formData.append("github", data.github || "");
        formData.append("linkedin", data.linkedin || "");
        formData.append("telegram", data.telegram || "");

        if (data.newPassword) {
            formData.append("currentPassword", data.currentPassword || "");
            formData.append("newPassword", data.newPassword);
        }

        // Only append file if one was selected in the input
        if (fileInputRef.current?.files?.[0]) {
            formData.append("profileImage", fileInputRef.current.files[0]);
        }

        const success = await updateProfile(formData);
        if (success) {
            // Clear password fields on success
            form.setValue("currentPassword", "");
            form.setValue("newPassword", "");
            form.setValue("confirmPassword", "");
        }
    };

    const triggerFileInput = () => {
        fileInputRef.current?.click();
    };

    if (!user) {
        return <div className="p-8 text-center">Loading profile...</div>;
    }

    return (
        <div className="container mx-auto py-10 px-4 max-w-3xl">
            <h1 className="text-3xl font-bold mb-8 text-slate-900 dark:text-white">Account Settings</h1>

            <Card className="border-slate-200 dark:border-slate-800 shadow-sm mb-8">
                <CardHeader>
                    <CardTitle>Profile Information</CardTitle>
                    <CardDescription>
                        Update your account's profile information and contact details.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">

                            {/* Avatar Section */}
                            <div className="flex flex-col items-center sm:items-start space-y-4">
                                <FormLabel>Profile Picture</FormLabel>
                                <div className="relative group cursor-pointer" onClick={triggerFileInput}>
                                    <Avatar className="h-24 w-24 border-2 border-slate-100 dark:border-slate-800 shadow-md transition-opacity group-hover:opacity-80">
                                        <AvatarImage src={previewImage || user.profileImage || ""} style={{ objectFit: "cover" }} />
                                        <AvatarFallback className="text-2xl font-bold bg-indigo-100 text-indigo-600 dark:bg-indigo-950 dark:text-indigo-400">
                                            {user.name?.charAt(0).toUpperCase()}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                                        <Camera className="h-8 w-8 text-white" />
                                    </div>
                                    <input
                                        type="file"
                                        ref={fileInputRef}
                                        className="hidden"
                                        accept="image/*"
                                        onChange={handleImageChange}
                                    />
                                </div>
                                <p className="text-xs text-slate-500 text-center sm:text-left">
                                    Click to upload a new profile picture.
                                </p>
                            </div>

                            <div className="grid gap-6 md:grid-cols-2">
                                <FormField
                                    control={form.control}
                                    name="name"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Full Name</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Your Name" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="email"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Email</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Your Email" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="phone"
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
                                    name="department"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Department</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Your Department" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="batch"
                                    render={({ field }) => (
                                        <FormItem>
                                            <div className="flex items-center justify-between">
                                                <FormLabel>Batch</FormLabel>
                                                {field.value && (
                                                    <div className="flex items-center gap-1.5 text-[10px] font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/40 px-2 py-0.5 rounded-full border border-indigo-100 dark:border-indigo-900/50">
                                                        <GraduationCap className="h-3 w-3" />
                                                        {calculateAcademicYear(field.value, form.getValues("department"))}
                                                    </div>
                                                )}
                                            </div>
                                            <FormControl>
                                                <Input placeholder="Your Batch" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            {user?.role !== "STUDENT" && (
                                <div className="space-y-4">
                                    <h3 className="text-lg font-medium text-slate-900 dark:text-slate-100">Social Links</h3>
                                    <div className="grid gap-6 md:grid-cols-1">
                                        <FormField
                                            control={form.control}
                                            name="github"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className="flex items-center gap-2">
                                                        <Github className="h-4 w-4" /> GitHub
                                                    </FormLabel>
                                                    <FormControl>
                                                        <Input placeholder="username" {...field} />
                                                    </FormControl>
                                                    <FormDescription>Your GitHub handle Username</FormDescription>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name="linkedin"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className="flex items-center gap-2">
                                                        <Linkedin className="h-4 w-4" /> LinkedIn
                                                    </FormLabel>
                                                    <FormControl>
                                                        <Input placeholder="username" {...field} />
                                                    </FormControl>
                                                    <FormDescription>Your LinkedIn username or URL</FormDescription>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name="telegram"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className="flex items-center gap-2">
                                                        <Send className="h-4 w-4" /> Telegram
                                                    </FormLabel>
                                                    <FormControl>
                                                        <Input placeholder="username" {...field} />
                                                    </FormControl>
                                                    <FormDescription>Your Telegram username (e.g., @username)</FormDescription>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>
                                </div>
                            )}

                            <div className="space-y-4 pt-4 border-t border-slate-100 dark:border-slate-800">
                                <h3 className="text-lg font-medium text-slate-900 dark:text-slate-100">Change Password</h3>
                                <div className="grid gap-6 md:grid-cols-1">
                                    <FormField
                                        control={form.control}
                                        name="currentPassword"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Current Password</FormLabel>
                                                <FormControl>
                                                    <Input type="password" placeholder="Enter current password" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <div className="grid gap-6 md:grid-cols-2">
                                        <FormField
                                            control={form.control}
                                            name="newPassword"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>New Password</FormLabel>
                                                    <FormControl>
                                                        <Input type="password" placeholder="Enter new password" {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name="confirmPassword"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Confirm New Password</FormLabel>
                                                    <FormControl>
                                                        <Input type="password" placeholder="Confirm new password" {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>
                                </div>
                            </div>


                            <div className="flex justify-end pt-4">
                                <Button
                                    type="submit"
                                    className="bg-indigo-600 hover:bg-indigo-700 min-w-[120px]"
                                    disabled={isLoading}
                                >
                                    {isLoading ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            Saving...
                                        </>
                                    ) : (
                                        <>
                                            <Save className="mr-2 h-4 w-4" />
                                            Save Changes
                                        </>
                                    )}
                                </Button>
                            </div>
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </div>
    );
}
