"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";
import Footer from "./footer";
import Navbar from "./navbar";
import { Toaster } from "sonner";
import { useAuthStore } from "@/store/useAuthStore";

const pathsNotShowHeaders = ["/admin", "/login", "/register", "/forgot-password"];
const pathsNotShowFooters = ["/admin", "/login", "/register", "/forgot-password", "/student/notification"];


export default function CommonLayout({ children }: { children: React.ReactNode }) {
    const { checkAuth, isLoading } = useAuthStore();
    const pathName = usePathname();

    const showHeader = !pathsNotShowHeaders.some((currentPath) =>
        pathName.startsWith(currentPath)
    );

    const showFooter = !pathsNotShowFooters.some((currentPath) =>
        pathName.startsWith(currentPath)
    );

    useEffect(() => {
        checkAuth();
    }, []);



    // Removed global loader to prevent unmounting of forms during API calls

    return (
        <div className="min-h-screen flex flex-col bg-white dark:bg-slate-950">
            {showHeader && <Navbar />}
            <div className="flex-1">
                {children}
            </div>
            {showFooter && <Footer />}
            <Toaster position="bottom-right" richColors />
        </div>
    );
}
