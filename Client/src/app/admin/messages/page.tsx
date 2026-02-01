"use client";

import { useEffect, useState } from "react";
import { Trash2, Calendar, User, MessageSquare, Clock } from "lucide-react";
import { useMessageStore } from "@/store/useMessageStore";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge"; // Assuming you have a Badge component in your UI lib

export default function AdminMessagesPage() {
    const { messages, getMessages, deleteMessage, markAllAsRead, isLoading } = useMessageStore();
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [messageToDelete, setMessageToDelete] = useState<string | null>(null);

    useEffect(() => {
        getMessages();
    }, [getMessages]);

    useEffect(() => {
        markAllAsRead();
    }, [markAllAsRead]);

    const openDeleteModal = (messageId: string) => {
        setMessageToDelete(messageId);
        setDeleteModalOpen(true);
    };

    const closeDeleteModal = () => {
        setMessageToDelete(null);
        setDeleteModalOpen(false);
    };

    const handleConfirmDelete = async () => {
        if (!messageToDelete) return;
        try {
            const result = await deleteMessage(messageToDelete);
            if (result) {
                toast.success("Message deleted successfully!");
                getMessages();
            }
        } catch (error) {
            toast.error("An error occurred while deleting.");
        } finally {
            closeDeleteModal();
        }
    };

    return (
        <div className="p-4 md:p-8 max-w-5xl mx-auto">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-900 leading-tight">Inbound Messages</h1>
                    <p className="text-sm text-gray-500">Manage and review messages from your community.</p>
                </div>
                <Badge variant="outline" className="px-3 py-1 shrink-0">
                    {messages.length} Total Messages
                </Badge>
            </div>

            {/* Message Grid */}
            <div className="grid grid-cols-1 gap-4">
                {messages.length === 0 && !isLoading && (
                    <div className="text-center py-20 border-2 border-dashed rounded-xl">
                        <MessageSquare className="mx-auto h-12 w-12 text-gray-300" />
                        <p className="mt-2 text-gray-500">No messages found.</p>
                    </div>
                )}

                {messages.map((msg) => (
                    <div
                        key={msg.id}
                        className="group relative bg-white border rounded-xl p-5 shadow-sm hover:shadow-md transition-all duration-200"
                    >
                        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                            <div className="flex items-start gap-4">
                                {/* Avatar Circle */}
                                <div className="hidden sm:flex w-12 h-12 rounded-full bg-indigo-100 text-indigo-700 items-center justify-center font-bold shrink-0">
                                    {msg.name.charAt(0).toUpperCase()}
                                </div>

                                <div className="space-y-1">
                                    <div className="flex items-center gap-2">
                                        <h3 className="font-semibold text-gray-900">{msg.name}</h3>
                                        <span className="text-gray-300">•</span>
                                        <div className="flex items-center text-xs text-gray-500">
                                            <Calendar className="w-3 h-3 mr-1" />
                                            {msg.createdAt ? new Date(msg.createdAt).toLocaleDateString() : "Recent"}
                                        </div>
                                    </div>

                                    <p className="text-gray-700 leading-relaxed text-sm whitespace-pre-wrap pt-1">
                                        {msg.message}
                                    </p>

                                </div>
                            </div>

                            <div className="flex md:flex-col items-center justify-end gap-2">
                                <Button
                                    size="sm"
                                    variant="ghost"
                                    className="text-red-500 hover:bg-red-50 opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity"
                                    onClick={() => openDeleteModal(msg.id)}
                                >
                                    <Trash2 className="h-4 w-4 mr-2" />
                                    Delete
                                </Button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Custom Modal for Deletion */}
            {deleteModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 text-center">
                    <div className="bg-white rounded-xl p-6 max-w-sm w-full shadow-2xl animate-in fade-in zoom-in duration-200">
                        <h3 className="text-lg font-bold text-gray-900 mb-2">Delete Message</h3>
                        <p className="text-sm text-gray-600 mb-6">
                            This message will be permanently removed. This action cannot be undone.
                        </p>
                        <div className="flex gap-3">
                            <Button onClick={closeDeleteModal} variant="outline" className="flex-1">
                                Cancel
                            </Button>
                            <Button onClick={handleConfirmDelete} className="flex-1 bg-red-600 hover:bg-red-700 text-white">
                                Delete
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
