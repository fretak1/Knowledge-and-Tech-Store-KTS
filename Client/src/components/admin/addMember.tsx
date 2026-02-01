"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { API_ROUTES } from "@/lib/api";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Upload } from "lucide-react";
import Image from "next/image";
import { useUserStore } from "@/store/useUserStore";

interface MemberInput {
    name: string;
    email?: string;
    department?: string;
    batch?: string;
    phone?: string;
    profileImage?: string;
}

interface Props {
    onSuccess?: () => void;
}

export default function AddMemberDialog({ onSuccess }: Props) {
    const [open, setOpen] = useState(false);
    const [profileImage, setProfileImage] = useState<File | null>(null);
    const { createMember, isLoading } = useUserStore();


    const [form, setForm] = useState<MemberInput>({
        name: "",
        email: "",
        department: "",
        batch: "",
        phone: "",
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            setProfileImage(e.target.files[0]);
        } else {
            setProfileImage(null);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const formData = new FormData();
        Object.entries(form).forEach(([key, value]) => {
            if (value !== undefined && value !== "") {
                formData.append(key, value);
            }
        });
        if (profileImage) {
            formData.append("profileImage", profileImage);
        }

        
        const success = await createMember(formData);

        if (success) {
            toast.success("Member added successfully");
            setOpen(false);

            setForm({
                name: "",
                email: "",
                department: "",
                batch: "",
                phone: "",
            });
            setProfileImage(null);
            onSuccess?.();
        } else {
            toast.error("Something went wrong. Try again!");
        }

    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="bg-indigo-600 hover:bg-indigo-700">
                    + Add Member
                </Button>
            </DialogTrigger>

            <DialogContent className="sm:max-w-2xl w-full">
                <DialogHeader>
                    <DialogTitle>Add New Member</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="border-2 flex items-center gap-4 justify-center border-dashed border-blue-400 bg-blue-50 p-8 rounded-lg text-center">
                        <div> 
                            <Upload className="mx-auto h-10 w-10 text-blue-500" />
                            <Label className="block mt-3 text-blue-600 cursor-pointer font-semibold">
                                Click to upload images
                                <Input
                                    type="file"
                                    className="hidden"
                                    onChange={handleFileChange}
                                />
                            </Label>
                        </div>
                        <div> {profileImage && (
                            <div className="flex flex-wrap gap-3 mt-4 justify-center">

                                <div className="relative w-20 h-20 rounded overflow-hidden shadow-sm">
                                    <Image
                                        src={URL.createObjectURL(profileImage)}
                                        alt={`preview`}
                                        width={80}
                                        height={80}
                                        className="object-cover w-full h-full"
                                    />
                                </div>
                            </div>
                        )}
                        </div>
                    </div>
                    <div>
                        <Label className="text-sm font-medium text-gray-700 mb-2">Name</Label>
                        <Input
                            name="name"
                            placeholder="Full name"
                            value={form.name}
                            onChange={handleChange}
                            disabled={isLoading}
                            required
                        />
                    </div>

                    <div>
                        <Label className="text-sm font-medium text-gray-700 mb-2">Email</Label>
                        <Input
                            name="email"
                            type="email"
                            placeholder="member@email.com"
                            value={form.email}
                            onChange={handleChange}
                            disabled={isLoading}
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <Label className="text-sm font-medium text-gray-700 mb-2">Department</Label>
                            <Input
                                name="department"
                                placeholder="Computer Science"
                                value={form.department}
                                onChange={handleChange}
                                disabled={isLoading}
                            />
                        </div>

                        <div>
                            <Label className="text-sm font-medium text-gray-700 mb-2">Batch</Label>
                            <Input
                                name="batch"
                                placeholder="2022"
                                value={form.batch}
                                onChange={handleChange}
                                disabled={isLoading}
                            />
                        </div>
                    </div>

                    <div>
                        <Label className="text-sm font-medium text-gray-700 mb-2">Phone</Label>
                        <Input
                            name="phone"
                            placeholder="Phone number"
                            value={form.phone}
                            onChange={handleChange}
                            disabled={isLoading}
                        />
                    </div>

                    <Button
                        type="submit"
                        className="w-full bg-indigo-600 hover:bg-indigo-700"
                        disabled={isLoading}
                    >
                        {isLoading ? "Creating..." : "Create Member"}
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    );
}
