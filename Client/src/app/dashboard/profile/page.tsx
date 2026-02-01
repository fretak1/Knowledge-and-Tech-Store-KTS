"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ProfileForm } from "./profile-form";
import { useAuthStore } from "@/store/useAuthStore";
import { Skeleton } from "@/components/ui/skeleton";

export default function ProfilePage() {
    const { user, isLoading } = useAuthStore();
    const router = useRouter();
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    if (!isMounted || isLoading) {
        return (
            <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md space-y-6">
                <Skeleton className="h-8 w-48 mb-6" />
                <div className="grid gap-6">
                    <div className="p-4 border rounded-md bg-gray-50 space-y-4">
                        <Skeleton className="h-6 w-40" />
                        <div className="space-y-2">
                            <Skeleton className="h-4 w-64" />
                            <Skeleton className="h-4 w-48" />
                            <Skeleton className="h-4 w-32" />
                        </div>
                    </div>
                    <div className="p-4 border rounded-md space-y-4">
                        <Skeleton className="h-6 w-32" />
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Skeleton className="h-4 w-20" />
                                <Skeleton className="h-10 w-full" />
                            </div>
                            <div className="space-y-2">
                                <Skeleton className="h-4 w-20" />
                                <Skeleton className="h-10 w-full" />
                            </div>
                        </div>
                        <Skeleton className="h-10 w-32" />
                    </div>
                </div>
            </div>
        );
    }

    if (!user) {
        router.push('/login');
        return null;
    }

    return (
        <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
            <h1 className="text-2xl font-bold mb-6">User Profile</h1>
            <div className="grid gap-6">
                <div className="p-4 border rounded-md bg-gray-50">
                    <h2 className="text-lg font-semibold mb-2">Account Details</h2>
                    <p><strong>Name:</strong> {user.name}</p>
                    <p><strong>Email:</strong> {user.email}</p>
                    <p><strong>Role:</strong> {user.role}</p>
                </div>

                <div className="p-4 border rounded-md">
                    <h2 className="text-lg font-semibold mb-4">Edit Profile</h2>
                    <ProfileForm user={user} />
                </div>
            </div>
        </div>
    );
}
