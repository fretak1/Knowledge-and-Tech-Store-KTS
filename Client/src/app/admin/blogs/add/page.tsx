// page.tsx
import { Suspense } from "react";
import AddOrEditBlogPageClient from "./AddOrEditBlogPageContent";

export default function Page() {
    return (
        // The Suspense boundary is the "shield" that fixes the build error
        <Suspense fallback={
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
            </div>
        }>
            <AddOrEditBlogPageClient />
        </Suspense>
    );
}