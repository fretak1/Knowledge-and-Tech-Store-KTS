"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Image from "next/image";
import { toast } from "sonner";
import { ArrowLeft, MapPin, Calendar as CalendarIcon, Upload } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useEventStore } from "@/store/useEventStore";

export default function AddOrEditEventPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const eventId = searchParams.get("id");

    const { createEvent, updateEvent, getEventById, isLoading } = useEventStore();
    const isEditMode = Boolean(eventId);

    const [form, setForm] = useState({
        title: "",
        description: "",
        date: "",
        type: "",
        location: "",
        imageUrl: "",
    });

    const [imageFile, setImageFile] = useState<File | null>(null);

    const previewSrc = imageFile
        ? URL.createObjectURL(imageFile)
        : form.imageUrl && form.imageUrl.startsWith("http")
            ? form.imageUrl
            : null;

    useEffect(() => {
        if (isEditMode && eventId) {
            getEventById(eventId).then((event) => {
                if (!event) {
                    toast.error("Event not found");
                    router.push("/admin/events");
                    return;
                }
                setForm({
                    title: event.title,
                    description: event.description || "",
                    date: event.date.split("T")[0],
                    type: event.type,
                    location: event.location || "",
                    imageUrl: event.imageUrl || "",
                });
            });
        }
    }, [eventId, isEditMode, getEventById, router]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async () => {
        const formData = new FormData();
        Object.entries(form).forEach(([key, value]) => {
            if (value) formData.append(key, value);
        });
        if (imageFile) formData.append("image", imageFile);

        let success = isEditMode && eventId ? await updateEvent(eventId, formData) : await createEvent(formData);

        if (success) {
            toast.success(`Event ${isEditMode ? "updated" : "created"} successfully`);
            router.push("/admin/events");
        } else {
            toast.error("Something went wrong");
        }
    };

    return (
        <div className="min-h-screen bg-[#F8FAFC] relative flex flex-col items-center">
            {/* FORM CARD SECTION */}
            <div className="relative z-10 w-full px-4 py-8 md:py-12 flex justify-center">
                <div className="w-full max-w-4xl bg-white rounded-[2.5rem] shadow-[0_30px_60px_-15px_rgba(0,0,0,0.1)] p-8 md:p-14 border border-gray-100">

                    {/* Header moved inside the form card for clarity */}
                    <header className="mb-10 border-b border-gray-50 pb-8">
                        <h1 className="text-4xl font-black text-gray-900 tracking-tight">
                            {isEditMode ? "Modify Event" : "Create New Event"}
                        </h1>
                    </header>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-8">

                        {/* Title (Full Width) */}
                        <div className="md:col-span-2 space-y-2">
                            <Label className="text-xs font-black uppercase tracking-widest text-gray-400 ml-1">Title *</Label>
                            <Input
                                name="title"
                                value={form.title}
                                onChange={handleChange}
                                placeholder="Enter requirement title"
                                className="rounded-2xl border-gray-100 bg-gray-50/50 h-16 px-6 focus:ring-indigo-600 text-lg"
                            />
                        </div>

                        {/* Date */}
                        <div className="space-y-2">
                            <Label className="text-xs font-black uppercase tracking-widest text-gray-400 ml-1">Event Date *</Label>
                            <div className="relative">
                                <Input
                                    type="date"
                                    name="date"
                                    value={form.date}
                                    onChange={handleChange}
                                    className="rounded-2xl border-gray-100 bg-gray-50/50 h-16 px-6 focus:ring-indigo-600"
                                />
                                <CalendarIcon className="absolute right-6 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                            </div>
                        </div>

                        {/* Location */}
                        <div className="space-y-2">
                            <Label className="text-xs font-black uppercase tracking-widest text-gray-400 ml-1">Location</Label>
                            <div className="relative">
                                <Input
                                    name="location"
                                    value={form.location}
                                    onChange={handleChange}
                                    placeholder="Scope or Venue"
                                    className="rounded-2xl border-gray-100 bg-gray-50/50 h-16 px-6 focus:ring-indigo-600"
                                />
                                <MapPin className="absolute right-6 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label className="text-xs font-black uppercase tracking-widest text-gray-400 ml-1">
                                Event Type *
                            </Label>

                            <Select
                                value={form.type}
                                onValueChange={(value) =>
                                    setForm({ ...form, type: value })
                                }
                            >
                                <SelectTrigger className="rounded-2xl border-gray-100 bg-gray-50/50 h-16 px-6 focus:ring-indigo-600">
                                    <SelectValue placeholder="Select event type" />
                                </SelectTrigger>

                                <SelectContent>
                                    <SelectItem value="conference">Conference</SelectItem>
                                    <SelectItem value="workshop">Workshop</SelectItem>
                                    <SelectItem value="seminar">Seminar</SelectItem>
                                    <SelectItem value="webinar">Webinar</SelectItem>
                                    <SelectItem value="competition">Competition</SelectItem>
                                    <SelectItem value="meetup">Meetup</SelectItem>
                                    <SelectItem value="training">Training</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Description */}
                        <div className="md:col-span-2 space-y-2">
                            <Label className="text-xs font-black uppercase tracking-widest text-gray-400 ml-1">Description</Label>
                            <Textarea
                                name="description"
                                value={form.description}
                                onChange={handleChange}
                                placeholder="Details about Area, Speed, Power, Reliability..."
                                className="rounded-2xl border-gray-100 bg-gray-50/50 min-h-[140px] p-6 focus:ring-indigo-600 text-base resize-none"
                            />
                        </div>

                        {/* Image Upload Area */}
                        <div className="md:col-span-2 space-y-2">
                            <Label className="text-xs font-black uppercase tracking-widest text-gray-400 ml-1">Visual Representation</Label>
                            <div className="flex flex-col md:flex-row items-center gap-6 p-6 border-2 border-dashed border-gray-200 rounded-[2rem] bg-gray-50/30">
                                <div className="flex-1 w-full">
                                    <Input
                                        type="file"
                                        onChange={(e) => setImageFile(e.target.files?.[0] || null)}
                                        className="rounded-xl border-gray-200 h-12 bg-white pt-2 cursor-pointer shadow-sm"
                                    />
                                </div>
                                {previewSrc && (
                                    <div className="relative w-24 h-24 rounded-2xl overflow-hidden border-4 border-white shadow-xl shrink-0">
                                        <Image
                                            src={previewSrc}
                                            alt="Preview"
                                            fill
                                            className="object-cover"
                                            unoptimized={!!imageFile}
                                        />
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Submit Button */}
                        <div className="md:col-span-2 pt-6">
                            <Button
                                onClick={handleSubmit}
                                disabled={isLoading}
                                className="w-full h-18 py-8 bg-indigo-600 hover:bg-indigo-700 text-white text-xl font-black rounded-[1.5rem] shadow-2xl shadow-indigo-100 transition-all hover:-translate-y-1 active:scale-[0.98]"
                            >
                                {isEditMode ? "Confirm Update" : "Create Event"}
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}