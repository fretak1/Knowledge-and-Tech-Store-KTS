"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Trash2 } from "lucide-react";

import { useUserStore } from "@/store/useUserStore";
import { Button } from "@/components/ui/button";
import AddMemberDialog from "@/components/admin/addMember";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";


interface Member {
    id: string;
    name: string;
    email?: string;
    department?: string;
    batch?: string;
    phone?: string;
    profileImage?: string;
}

const calculateYear = (batch?: string) => {
    if (!batch) return "-";
    const currentYear = new Date().getFullYear();
    const year = currentYear - Number(batch);
    return year > 0 ? `${year}` : "-";
};

export default function AdminMembersPage() {
    const { members, getMembers, deleteMember, isLoading } = useUserStore();
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [memberToDelete, setMemberToDelete] = useState<string | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);

    useEffect(() => {
        getMembers();
    }, [getMembers]);

    const openDeleteModal = (memberId: string) => {
        setMemberToDelete(memberId);
        setDeleteModalOpen(true);
    };

    const closeDeleteModal = () => {
        setMemberToDelete(null);
        setDeleteModalOpen(false);
    };

    const handleConfirmDelete = async () => {
        if (!memberToDelete) return;
        setIsDeleting(true);
        try {
            const result = await deleteMember(memberToDelete);
            if (result) {
                toast.success("Member deleted successfully!");
                getMembers();
            } else {
                toast.error("Failed to delete member.");
            }
        } catch (error) {
            toast.error("An error occurred while deleting the member.");
        } finally {
            setIsDeleting(false);
            closeDeleteModal();
        }
    };


    return (
        <div className="space-y-8 p-6 md:p-8">
            {/* Header */}
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold">Members</h1>
                <AddMemberDialog onSuccess={getMembers} />
            </div>

            {/* Members Table */}
            <div className="rounded-xl border bg-white shadow-sm overflow-hidden">
                <div className="overflow-x-auto custom-scrollbar">
                    <table className="w-full min-w-[800px]">
                        <thead className="bg-gray-50 text-sm">
                            <tr>
                                <th className="px-6 py-3 text-left">Member</th>
                                <th className="px-6 py-3 text-left">Year</th>
                                <th className="px-6 py-3 text-left">Phone</th>
                                <th className="px-6 py-3 text-left">Department</th>
                                <th className="px-6 py-3 text-right">Action</th>
                            </tr>
                        </thead>

                        <tbody>
                            {isLoading ? (
                                <>
                                    {[1, 2, 3, 4, 5].map((i) => (
                                        <tr key={i} className="border-t">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-4">
                                                    <Skeleton className="h-10 w-10 rounded-full" />
                                                    <div className="space-y-2">
                                                        <Skeleton className="h-4 w-32" />
                                                        <Skeleton className="h-3 w-48" />
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4"><Skeleton className="h-4 w-8" /></td>
                                            <td className="px-6 py-4"><Skeleton className="h-4 w-24" /></td>
                                            <td className="px-6 py-4"><Skeleton className="h-4 w-24" /></td>
                                            <td className="px-6 py-4 text-right"><Skeleton className="h-8 w-8 ml-auto" /></td>
                                        </tr>
                                    ))}
                                </>
                            ) : (
                                members.map((m: Member) => (
                                    <tr
                                        key={m.id}
                                        className="border-t hover:bg-gray-50 transition"
                                    >
                                        {/* Member info */}
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-4">
                                                {m.profileImage ? (
                                                    <div className="relative w-10 h-10 rounded-full overflow-hidden bg-gray-200">
                                                        <Image
                                                            src={m.profileImage}
                                                            alt={m.name}
                                                            fill
                                                            className="object-cover"
                                                        />
                                                    </div>
                                                ) : (
                                                    // Fallback avatar with first letter
                                                    <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold text-lg">
                                                        {m.name.charAt(0).toUpperCase()}
                                                    </div>
                                                )}
                                                <div>
                                                    <p className="font-medium">{m.name}</p>
                                                    <p className="text-sm text-muted-foreground">
                                                        {m.email || "-"}
                                                    </p>
                                                </div>
                                            </div>
                                        </td>

                                        {/* Year */}
                                        <td className="px-6 py-4 text-sm">
                                            {calculateYear(m.batch)}
                                        </td>

                                        {/* Phone */}
                                        <td className="px-6 py-4 text-sm">
                                            {m.phone || "-"}
                                        </td>

                                        {/* Department */}
                                        <td className="px-6 py-4 text-sm">
                                            {m.department || "-"}
                                        </td>

                                        {/* Action */}
                                        <td className="px-6 py-4 text-right">
                                            <Button
                                                size="icon"
                                                variant="ghost"
                                                className="text-red-500 hover:bg-red-50"
                                                onClick={() => openDeleteModal(m.id)}                                    >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </td>
                                    </tr>
                                ))
                            )}

                            {!isLoading && members.length === 0 && (
                                <tr>
                                    <td
                                        colSpan={5}
                                        className="py-10 text-center text-sm text-muted-foreground"
                                    >
                                        No members found
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>


            {deleteModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
                    <div className="bg-white rounded-lg p-6 max-w-sm w-full shadow-lg">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">
                            Confirm Delete
                        </h3>
                        <p className="text-sm text-gray-700 mb-6">
                            Are you sure you want to delete this member? This action cannot
                            be undone.
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
