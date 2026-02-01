"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Trash2, Edit, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useBlogsStore } from "@/store/useBlogsStore";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";

export default function AdminBlogsPage() {
    const { blogs, fetchBlogs, isLoading, deleteBlog } = useBlogsStore();
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [blogToDelete, setBlogToDelete] = useState<string | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);

    const router = useRouter();

    useEffect(() => {
        fetchBlogs();
    }, [fetchBlogs]);

    const openDeleteModal = (id: string) => {
        setBlogToDelete(id);
        setDeleteModalOpen(true);
    };

    const closeDeleteModal = () => {
        setBlogToDelete(null);
        setDeleteModalOpen(false);
    };

    const handleConfirmDelete = async () => {
        if (blogToDelete) {
            setIsDeleting(true);
            try {
                const result = await deleteBlog(blogToDelete);
                if (result) {
                    toast.success("Blog deleted successfully!");
                } else {
                    toast.error("Failed to delete blog.");
                }
            } catch (error) {
                toast.error("An error occurred while deleting the blog.");
            } finally {
                setIsDeleting(false);
                closeDeleteModal();
            }
        }
    };

    return (
        <div className="space-y-8 p-4 md:p-8">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <h1 className="text-2xl font-bold text-gray-900 border-b-2 border-indigo-600 pb-2">Manage Blogs</h1>
                <Button
                    className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700 text-white shadow-md hover:shadow-lg transition-all"
                    onClick={() => router.push("/admin/blogs/add")}
                >
                    + Add New Blog
                </Button>
            </div>

            {/* Blog Cards */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {isLoading ? (
                    <>
                        {[1, 2, 3, 4].map((i) => (
                            <div key={i} className="border border-gray-100 rounded-2xl overflow-hidden shadow-sm bg-white p-5 space-y-4">
                                <Skeleton className="h-48 w-full rounded-xl" />
                                <div className="space-y-2">
                                    <Skeleton className="h-6 w-3/4" />
                                    <Skeleton className="h-4 w-full" />
                                    <Skeleton className="h-4 w-5/6" />
                                </div>
                                <div className="pt-2 border-t border-gray-50 flex justify-between">
                                    <Skeleton className="h-4 w-24" />
                                </div>
                            </div>
                        ))}
                    </>
                ) : (
                    blogs.map((blog) => (
                        <div key={blog.id} className="border border-gray-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all relative bg-white group">
                            <div className="relative h-48 w-full overflow-hidden">
                                {blog.imageUrls && blog.imageUrls.length > 0 ? (
                                    <Image
                                        src={blog.imageUrls[0]}
                                        alt={blog.title}
                                        fill
                                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                                    />
                                ) : (
                                    <div className="bg-gradient-to-br from-indigo-500 to-purple-600 h-full w-full flex items-center justify-center text-white">
                                        <BookOpen className="h-12 w-12 opacity-50" />
                                    </div>
                                )}
                                <div className="absolute top-4 left-4">
                                    <span className="bg-white/90 backdrop-blur-sm text-indigo-600 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider shadow-sm">
                                        {blog.category}
                                    </span>
                                </div>
                            </div>
                            <div className="p-5 space-y-3">
                                <h2 className="font-bold text-xl text-gray-900 line-clamp-1">{blog.title}</h2>
                                <p className="text-sm text-gray-600 line-clamp-2 leading-relaxed">{blog.content}</p>
                                <div className="flex items-center justify-between pt-2 border-t border-gray-50">
                                    <p className="text-xs font-medium text-gray-400">
                                        {new Date(blog.createdAt).toLocaleDateString(undefined, {
                                            year: 'numeric',
                                            month: 'short',
                                            day: 'numeric'
                                        })}
                                    </p>
                                </div>
                            </div>
                            <div className="absolute top-2 right-2 flex gap-1 transform translate-y-1 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                                <Button
                                    variant="secondary"
                                    size="sm"
                                    className="bg-white/90 backdrop-blur-sm hover:bg-white text-gray-700 h-8 w-8 p-0 rounded-full shadow-sm"
                                    onClick={() => router.push(`/admin/blogs/add?id=${blog.id}`)}
                                >
                                    <Edit className="h-3.5 w-3.5" />
                                </Button>
                                <Button
                                    variant="destructive"
                                    size="sm"
                                    className="bg-red-500/90 backdrop-blur-sm hover:bg-red-500 text-white h-8 w-8 p-0 rounded-full shadow-sm"
                                    onClick={() => openDeleteModal(blog.id)}
                                >
                                    <Trash2 className="h-3.5 w-3.5" />
                                </Button>
                            </div>
                        </div>
                    ))
                )}

                {!isLoading && blogs.length === 0 && (
                    <div className="col-span-full py-24 text-center bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
                        < BookOpen className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-900">No blogs found</h3>
                        <p className="text-sm text-gray-500 mt-1">Start by creating your first blog post!</p>
                    </div>
                )}
            </div>

            {deleteModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
                    <div className="bg-white rounded-lg p-6 max-w-sm w-full shadow-lg">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">
                            Confirm Delete
                        </h3>
                        <p className="text-sm text-gray-700 mb-6">
                            Are you sure you want to delete this blog post?
                        </p>
                        <div className="flex justify-end gap-3">
                            <Button
                                onClick={closeDeleteModal}
                                variant="outline"
                                className="px-4 py-2 rounded-md"
                                disabled={isDeleting}
                            >
                                Cancel
                            </Button>
                            <Button
                                onClick={handleConfirmDelete}
                                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md"
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
