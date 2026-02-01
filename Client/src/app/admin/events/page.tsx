"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Trash2, Edit } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEventStore } from "@/store/useEventStore";
import AddEvent from "@/components/events/addEvent";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";



export default function AdminEventsPage() {
    const { events, fetchEvents, isLoading, deleteEvent } = useEventStore();
    const [openAdd, setOpenAdd] = useState(false);
    const [editEvent, setEditEvent] = useState<any | null>(null);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [eventToDelete, setEventToDelete] = useState<string | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);


    const router = useRouter();

    const openDeleteModal = (id: string) => {
        setEventToDelete(id);
        setDeleteModalOpen(true);
    };

    const closeDeleteModal = () => {
        setEventToDelete(null);
        setDeleteModalOpen(false);
    };

    const handleConfirmDelete = async () => {
        if (eventToDelete) {
            setIsDeleting(true);
            try {
                const result = await deleteEvent(eventToDelete);
                if (result) {
                    toast.success("Event deleted successfully!");
                } else {
                    toast.error("Failed to delete event.");
                }
            } catch (error) {
                toast.error("An error occurred while deleting the event.");
            } finally {
                setIsDeleting(false);
                closeDeleteModal();
            }
        }
    };



    useEffect(() => {
        fetchEvents();
    }, [fetchEvents]);

    return (
        <div className="space-y-8 p-6 md:p-8">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold">Manage Events</h1>
                <Button className="bg-indigo-600 hover:bg-indigo-700" onClick={() => router.push("/admin/events/add")}>
                    + Add Event
                </Button>
            </div>



            {/* Event Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-2 gap-6">
                {isLoading ? (
                    <>
                        {[1, 2, 3, 4].map((i) => (
                            <div key={i} className="border rounded-lg overflow-hidden shadow bg-white p-4 space-y-4">
                                <Skeleton className="aspect-[2/3] w-full rounded-md" />
                                <div className="space-y-2">
                                    <Skeleton className="h-6 w-3/4" />
                                    <Skeleton className="h-4 w-full" />
                                    <Skeleton className="h-4 w-24" />
                                </div>
                            </div>
                        ))}
                    </>
                ) : (
                    events.map((event) => (
                        <div key={event.id} className="border rounded-lg overflow-hidden shadow hover:shadow-lg transition relative bg-white">
                            <div className="relative aspect-[2/3] w-full">
                                {event.imageUrl ? (
                                    <Image src={event.imageUrl.startsWith("http") ? event.imageUrl : "/placeholder.jpg"} alt={event.title} fill className="object-cover" />
                                ) : (
                                    <div className="bg-indigo-600 h-full w-full flex items-center justify-center text-white text-3xl font-bold">
                                        {event.title.charAt(0).toUpperCase()}
                                    </div>
                                )}
                            </div>
                            <div className="p-4 space-y-2">
                                <h2 className="font-semibold text-lg">{event.title}</h2>
                                <p className="text-sm text-gray-600">{event.description}</p>
                                <p className="text-sm font-medium">{new Date(event.date).toLocaleDateString()}</p>
                                {event.location && <p className="text-sm text-gray-500">{event.location}</p>}
                            </div>
                            <div className="absolute top-2 right-2 flex gap-2">
                                <Button variant="ghost" size="icon" onClick={() => router.push(`/admin/events/add?id=${event.id}`)}>
                                    <Edit className="h-4 w-4" />
                                </Button>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="text-red-500"
                                    onClick={() => openDeleteModal(event.id)}
                                >
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                    ))
                )}

                {!isLoading && events.length === 0 && (
                    <div className="col-span-full py-20 text-center text-sm text-muted-foreground">
                        No events found
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
                            Are you sure you want to delete this event?
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
