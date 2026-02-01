"use client";

import { useEffect } from "react";
import { useNotificationStore } from "@/store/useNotificationStore";
import { Bell, CheckCircle2, Clock } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";

export default function NotificationsPage() {
    const { notifications, getNotifications, isLoading } = useNotificationStore();

    useEffect(() => {
        getNotifications();
    }, [getNotifications]);

    return (
        <div className="max-w-2xl mx-auto p-6">
            <div className="flex items-center justify-between mb-8">
                <h1 className="text-2xl font-bold">Notifications</h1>
                <Bell className="text-slate-400" />
            </div>

            {isLoading ? (
                <div className="space-y-4">
                    {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 flex gap-3">
                            <Skeleton className="h-8 w-8 rounded-full shrink-0" />
                            <div className="flex-1 space-y-2">
                                <Skeleton className="h-4 w-full" />
                                <Skeleton className="h-3 w-24" />
                            </div>
                        </div>
                    ))}
                </div>
            ) : notifications.length === 0 ? (
                <div className="text-center py-20 border-2 border-dashed rounded-xl">
                    <p className="text-slate-500">No notifications yet.</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {notifications.map((n) => (
                        <div
                            key={n.id}
                            //  onClick={() => !n.isRead && markAsRead(n.id)}
                            className={`p-4 rounded-xl border transition-all cursor-pointer ${n.isRead
                                ? "bg-slate-50 border-slate-200 opacity-70"
                                : "bg-white border-indigo-100 shadow-sm ring-1 ring-indigo-50"
                                }`}
                        >
                            <div className="flex gap-3">
                                <div className={`p-2 rounded-full h-fit ${n.isRead ? "bg-slate-200" : "bg-indigo-100"}`}>
                                    <CheckCircle2 className={`h-4 w-4 ${n.isRead ? "text-slate-500" : "text-indigo-600"}`} />
                                </div>
                                <div className="flex-1">
                                    <p className={`text-sm ${n.isRead ? "text-slate-600" : "text-slate-900 font-semibold"}`}>
                                        {n.message}
                                    </p>
                                    <div className="flex items-center gap-1 mt-2 text-[10px] text-slate-400">
                                        <Clock className="h-3 w-3" />
                                        {formatDistanceToNow(new Date(n.createdAt), { addSuffix: true })}
                                    </div>
                                </div>
                                {!n.isRead && (
                                    <div className="h-2 w-2 bg-indigo-600 rounded-full mt-2"></div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}