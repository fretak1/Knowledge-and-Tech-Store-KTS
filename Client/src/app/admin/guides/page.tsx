"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Trash2, Edit, PlayCircle, BookText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useGuideStore } from "@/store/useGuideStore";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

export default function AdminGuidesPage() {
    const { guides, fetchGuides, isLoading, deleteGuide } = useGuideStore();
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [guideToDelete, setGuideToDelete] = useState<string | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);

    const router = useRouter();

    useEffect(() => {
        fetchGuides();
    }, [fetchGuides]);

    const openDeleteModal = (id: string) => {
        setGuideToDelete(id);
        setDeleteModalOpen(true);
    };

    const closeDeleteModal = () => {
        setGuideToDelete(null);
        setDeleteModalOpen(false);
    };

    const handleConfirmDelete = async () => {
        if (guideToDelete) {
            setIsDeleting(true);
            try {
                const result = await deleteGuide(guideToDelete);
                if (result) {
                    toast.success("Guide deleted successfully!");
                } else {
                    toast.error("Failed to delete guide.");
                }
            } catch (error) {
                toast.error("An error occurred while deleting the guide.");
            } finally {
                setIsDeleting(false);
                closeDeleteModal();
            }
        }
    };

    const getVideoThumbnail = (videoUrl: string) => {
        // YouTube thumbnail
        if (videoUrl.includes('youtube.com') || videoUrl.includes('youtu.be')) {
            const videoId = videoUrl.includes('youtu.be')
                ? videoUrl.split('youtu.be/')[1]?.split('?')[0]
                : new URL(videoUrl).searchParams.get('v');
            return videoId ? `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg` : null;
        }
        // Cloudinary video thumbnail
        if (videoUrl.includes('cloudinary.com')) {
            return videoUrl.replace('/upload/', '/upload/so_0,w_800,h_450,c_fill/').replace(/\.[^.]+$/, '.jpg');
        }
        return null;
    };

    return (
        <div className="space-y-8 p-6 md:p-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Manage Guides</h1>
                    <p className="text-gray-500 mt-1">Create and manage instructional video guides.</p>
                </div>
                <Button className="bg-indigo-600 hover:bg-indigo-700 h-12 px-6 rounded-xl shadow-lg shadow-indigo-500/20 transition-all hover:-translate-y-0.5" onClick={() => router.push("/admin/guides/add")}>
                    <BookText className="mr-2 h-5 w-5" /> Add New Guide
                </Button>
            </div>

            {/* Guides Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {isLoading ? (
                    <>
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="border border-gray-100 rounded-3xl overflow-hidden shadow-sm bg-white p-6 space-y-4">
                                <Skeleton className="h-48 w-full rounded-2xl" />
                                <div className="space-y-2">
                                    <Skeleton className="h-6 w-3/4" />
                                    <Skeleton className="h-4 w-full" />
                                    <Skeleton className="h-4 w-full" />
                                </div>
                                <div className="pt-4 border-t border-gray-50 flex justify-between">
                                    <Skeleton className="h-4 w-16" />
                                    <div className="flex gap-2">
                                        <Skeleton className="h-9 w-9 rounded-xl" />
                                        <Skeleton className="h-9 w-9 rounded-xl" />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </>
                ) : (
                    guides.map((guide) => {
                        const thumbnail = getVideoThumbnail(guide.video);
                        return (
                            <div key={guide.id} className="group border border-gray-100 rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 relative bg-white flex flex-col">
                                <div className="relative h-48 bg-slate-900 overflow-hidden">
                                    {thumbnail ? (
                                        <img
                                            src={thumbnail}
                                            alt={guide.title}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                        />
                                    ) : (
                                        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/20 to-purple-500/20"></div>
                                    )}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <div className="h-14 w-14 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center group-hover:bg-indigo-600/90 transition-all duration-300">
                                            <PlayCircle className="w-8 h-8 text-white" />
                                        </div>
                                    </div>
                                </div>

                                <div className="p-6 flex-1 flex flex-col">
                                    <h2 className="font-bold text-xl text-gray-900 mb-2 line-clamp-1 group-hover:text-indigo-600 transition-colors">{guide.title}</h2>
                                    <p className="text-sm text-gray-500 line-clamp-3 mb-4 flex-1">{guide.description}</p>

                                    <div className="flex items-center justify-between pt-4 border-t border-gray-50">
                                        <a
                                            href={guide.video}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-[10px] font-black uppercase tracking-widest text-indigo-500 hover:text-indigo-700 transition-colors"
                                        >
                                            View Video
                                        </a>
                                        <div className="flex gap-2">
                                            <Button variant="ghost" size="icon" className="h-9 w-9 rounded-xl hover:bg-indigo-50 hover:text-indigo-600 transition-colors" onClick={() => router.push(`/admin/guides/add?id=${guide.id}`)}>
                                                <Edit className="h-4 w-4" />
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-9 w-9 rounded-xl hover:bg-red-50 hover:text-red-600 transition-colors"
                                                onClick={() => openDeleteModal(guide.id)}
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })
                )}

                {!isLoading && guides.length === 0 && (
                    <div className="col-span-full py-32 text-center bg-white rounded-[2.5rem] border border-dashed border-gray-200">
                        <BookText className="h-16 w-16 text-gray-200 mx-auto mb-4" />
                        <h3 className="text-xl font-bold text-gray-900">No guides found</h3>
                        <p className="text-gray-500 mt-2">Start by creating your first instructional guide.</p>
                        <Button className="mt-6 bg-indigo-600 hover:bg-indigo-700" onClick={() => router.push("/admin/guides/add")}>
                            Create a Guide
                        </Button>
                    </div>
                )}
            </div>

            {deleteModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm">
                    <div className="bg-white rounded-[2rem] p-8 max-w-sm w-full shadow-2xl animate-in zoom-in-95 duration-200">
                        <div className="h-14 w-14 bg-red-50 rounded-2xl flex items-center justify-center mb-6">
                            <Trash2 className="h-7 w-7 text-red-500" />
                        </div>
                        <h3 className="text-2xl font-black text-gray-900 mb-3">
                            Delete Guide?
                        </h3>
                        <p className="text-gray-500 mb-8 font-medium">
                            Are you sure you want to remove this guide? This action cannot be undone.
                        </p>
                        <div className="flex gap-3">
                            <Button
                                onClick={closeDeleteModal}
                                variant="ghost"
                                className="flex-1 h-14 rounded-2xl font-bold text-gray-500 hover:bg-gray-100"
                                disabled={isDeleting}
                            >
                                Keep it
                            </Button>
                            <Button
                                onClick={handleConfirmDelete}
                                className="flex-1 h-14 bg-red-500 hover:bg-red-600 text-white rounded-2xl font-bold shadow-lg shadow-red-200 transition-all hover:-translate-y-0.5"
                                loading={isDeleting}
                            >
                                Delete
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
