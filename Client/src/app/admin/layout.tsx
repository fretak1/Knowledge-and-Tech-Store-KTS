"use client";

import AdminSidebar from "@/components/admin/adminSideBar";
import { cn } from "@/lib/utils";
import { useState } from "react";


function adminLayout({ children }: { children: React.ReactNode }) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    return (
        <div className="h-screen bg-gray-50 flex overflow-hidden">
            <AdminSidebar
                isOpen={isSidebarOpen}
                toggle={() => setIsSidebarOpen(!isSidebarOpen)}
            />
            <main className="flex-1 min-h-screen overflow-y-auto no-scrollbar">
                {children}
            </main>
        </div>
    );
}

export default adminLayout;
