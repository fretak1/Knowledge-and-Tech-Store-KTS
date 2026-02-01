"use client";

import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import { useUserStore } from "@/store/useUserStore";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { calculateAcademicYear } from "@/lib/utils";

interface Member {
    id: string;
    name: string;
    email?: string;
    department?: string;
    batch?: string;
    phone?: string;
    profileImage?: string;
    createdAt?: string;
}



export default function AdminStudentsPage() {
    const { students, getStudents, isLoading, searchStudents } = useUserStore();

    useEffect(() => {
        getStudents();
    }, [getStudents]);

    const [searchQuery, setSearchQuery] = useState("");
    const [searchField, setSearchField] = useState<"name" | "department" | "batch">("name");

    const debounceRef = useRef<NodeJS.Timeout | null>(null);

    const handleSearchChange = (query: string) => {
        setSearchQuery(query);

        if (debounceRef.current) {
            clearTimeout(debounceRef.current);
        }

        debounceRef.current = setTimeout(async () => {
            try {
                if (query.length < 2) {
                    getStudents(); // Reset to all students if query too short
                    return;
                }
                await searchStudents(query, searchField);
            } catch (error) {
                console.error(error);
                toast.error("Failed to search students");
            }
        }, 300); // 300ms debounce
    };

    return (
        <div className="space-y-8 p-4 md:p-8">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <h1 className="text-2xl font-bold">Students</h1>
                <div className="flex flex-wrap items-center gap-3">
                    <Input
                        type="text"
                        placeholder={`Search by ${searchField}`}
                        className="border rounded px-3 py-1 text-sm w-full sm:w-60"
                        value={searchQuery}
                        onChange={(e) => handleSearchChange(e.target.value)}
                    />
                    <Select
                        value={searchField}
                        onValueChange={(value: "name" | "department" | "batch") =>
                            setSearchField(value)
                        }
                    >
                        <SelectTrigger className="w-full sm:w-36 border rounded px-3 py-1 text-sm">
                            <SelectValue placeholder="Select field" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="name">By Name</SelectItem>
                            <SelectItem value="department">By Department</SelectItem>
                            <SelectItem value="batch">By Batch</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
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
                                <th className="px-6 py-3 text-left">Date of registration</th>
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
                                            <td className="px-6 py-4"><Skeleton className="h-4 w-32" /></td>
                                        </tr>
                                    ))}
                                </>
                            ) : (
                                students.map((student) => (
                                    <tr
                                        key={student.id}
                                        className="border-t hover:bg-gray-50 transition"
                                    >
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-4">
                                                {student.profileImage ? (
                                                    <div className="relative w-10 h-10 rounded-full overflow-hidden bg-gray-200">
                                                        <Image
                                                            src={student.profileImage}
                                                            alt={student.name}
                                                            fill
                                                            className="object-cover"
                                                        />
                                                    </div>
                                                ) : (
                                                    <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold text-lg">
                                                        {student.name.charAt(0).toUpperCase()}
                                                    </div>
                                                )}
                                                <div>
                                                    <p className="font-medium">{student.name}</p>
                                                    <p className="text-sm text-muted-foreground">{student.email || "-"}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-sm">{calculateAcademicYear(student.batch, student.department)}</td>
                                        <td className="px-6 py-4 text-sm">{student.phone || "-"}</td>
                                        <td className="px-6 py-4 text-sm">{student.department || "-"}</td>
                                        <td className="px-6 py-4 text-sm">
                                            {student.createdAt
                                                ? new Date(student.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
                                                : "-"}
                                        </td>
                                    </tr>
                                ))
                            )}

                            {!isLoading && students.length === 0 && (
                                <tr>
                                    <td colSpan={5} className="py-10 text-center text-sm text-muted-foreground">
                                        No students found
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
