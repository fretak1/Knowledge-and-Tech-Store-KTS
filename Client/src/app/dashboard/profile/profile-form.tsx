"use client";

import { useState } from 'react';
import { CldUploadWidget } from 'next-cloudinary';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { useUserStore } from '@/store/useUserStore';

export function ProfileForm({ user }: { user: any }) {
    const [name, setName] = useState(user.name || '');
    const [imageUrl, setImageUrl] = useState(user.profileImage || '');
    const { updateProfile, isLoading: isUpdating } = useUserStore();

    const handleUpload = (result: any) => {
        if (result.event === 'success') {
            setImageUrl(result.info.secure_url);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append("name", name);
        if (imageUrl) {
            formData.append("profileImage", imageUrl);
        }

        const data = await updateProfile(formData);
        if (data && data.user) {
            toast.success('Profile updated successfully!');
            // Optional: window.location.reload() or update auth store user
            // Since this component is inside ProfilePage which uses useAuthStore, 
            // we might want to update it if it doesn't happen automatically.
        } else {
            toast.error("Failed to update profile");
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex flex-col gap-4">
                <Label>Profile Image</Label>
                <div className="flex items-center gap-4">
                    {imageUrl && (
                        <div className="w-20 h-20 rounded-full overflow-hidden border">
                            <img src={imageUrl} alt="Profile" className="w-full h-full object-cover" />
                        </div>
                    )}
                    <CldUploadWidget uploadPreset="kts_site_preset" onSuccess={handleUpload}>
                        {({ open }) => {
                            return (
                                <Button type="button" variant="outline" onClick={() => open()}>
                                    Upload Image
                                </Button>
                            );
                        }}
                    </CldUploadWidget>
                </div>
            </div>

            <div className="grid w-full max-w-sm items-center gap-1.5">
                <Label htmlFor="name">Name</Label>
                <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your Name"
                />
            </div>

            <Button type="submit" loading={isUpdating}>
                Save Changes
            </Button>
        </form>
    );
}
