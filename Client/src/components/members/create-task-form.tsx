"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useUserStore } from "@/store/useUserStore";
import { useTaskStore } from "@/store/useTaskStore";
import { Button } from "@/components/ui/button";

const schema = z.object({
    title: z.string().min(1, "Title is required"),
    description: z.string().min(1, "Description is required"),
    device: z.string().min(1, "Device type is required"),
    manufacturer: z.string().min(1, "Manufacturer is required"),
    serialNumber: z.string().min(1, "Serial number is required"),
    studentId: z.string().min(1, "Student is required"),
});

type FormData = z.infer<typeof schema>;

export default function CreateTaskForm() {
    const { students, searchStudents } = useUserStore();
    const { createTask, } = useTaskStore();

    const deviceManufacturers: Record<string, string[]> = {
        PC: ["Apple", "HP", "Dell", "Lenovo", "Asus", "Toshiba", "Acer", "MSI", "Other"],
        PHONE: ["Apple", "Samsung", "Google", "Realme", "Infinix", "Tecno", "Other"],
        TABLETS: ["Apple", "Samsung", "Amazon", "Lenovo", "Microsoft", "Other"],
    };

    const [selectedStudent, setSelectedStudent] = useState<{
        id: string;
        name: string;
        department?: string;
        batch?: string;
    } | null>(null);

    const [message, setMessage] = useState<{
        type: "success" | "error";
        text: string;
    } | null>(null);

    const {
        register,
        handleSubmit,
        setValue,
        reset,
        watch,
        formState: { errors, isSubmitting },
    } = useForm<FormData>({
        resolver: zodResolver(schema),
    });

    const watchDevice = watch("device");

    const onSubmit = async (data: FormData) => {
        setMessage(null);

        try {

            await createTask(data);
            setMessage({ type: "success", text: "Task created successfully" });
            reset();
            setSelectedStudent(null);

            searchStudents("", "name"); // OR clearStudents()

        } catch (error) {
            setMessage({ type: "error", text: "Failed to submit task" });
        }
    };

    return (
        <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-5 bg-white p-6 rounded-xl shadow-md"
        >
            <h3 className="text-xl font-semibold">Create New Task</h3>

            {message && (
                <div
                    className={`p-3 rounded-md text-sm ${message.type === "success"
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                        }`}
                >
                    {message.text}
                </div>
            )}

            {/* =====================
          Student Search
      ====================== */}
            <div className="relative">
                <label className="block text-sm font-medium text-gray-700">
                    Student
                </label>

                <input
                    type="text"
                    placeholder="Search student by name..."
                    onChange={(e) => searchStudents(e.target.value, "name")}
                    disabled={isSubmitting}
                    className="mt-1 w-full rounded-md border p-2 focus:ring-indigo-500 focus:border-indigo-500"
                />

                {/* Autocomplete Dropdown */}
                {students.length > 0 && !selectedStudent && (
                    <div className="absolute z-10 mt-1 w-full rounded-md border bg-white shadow-lg max-h-56 overflow-y-auto">
                        {students.map((student) => (
                            <button
                                type="button"
                                key={student.id}
                                onClick={() => {
                                    setSelectedStudent(student);
                                    setValue("studentId", student.id, {
                                        shouldValidate: true,
                                    });
                                }}
                                className="w-full text-left px-4 py-2 hover:bg-indigo-50 transition"
                            >
                                <p className="font-medium">{student.name}</p>
                                <p className="text-xs text-gray-500">
                                    {student.department} • {student.batch}
                                </p>
                            </button>
                        ))}
                    </div>
                )}

                {/* Selected Student */}
                {selectedStudent && (
                    <div className="mt-2 flex items-center justify-between rounded-md border p-2 bg-indigo-50">
                        <div>
                            <p className="text-sm font-semibold">
                                {selectedStudent.name}
                            </p>
                            <p className="text-xs text-gray-600">
                                {selectedStudent.department} • {selectedStudent.batch}
                            </p>
                        </div>
                        <button
                            type="button"
                            onClick={() => {
                                setSelectedStudent(null);
                                setValue("studentId", "");
                            }}
                            className="text-xs text-red-500 hover:underline"
                        >
                            Change
                        </button>
                    </div>
                )}

                {errors.studentId && (
                    <p className="text-red-500 text-xs mt-1">
                        {errors.studentId.message}
                    </p>
                )}
            </div>

            {/* =====================
          Device Selection
      ====================== */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700">
                        Device Type
                    </label>
                    <select
                        {...register("device")}
                        className="mt-1 w-full rounded-md border p-2 focus:ring-indigo-500 focus:border-indigo-500"
                        onChange={(e) => {
                            setValue("device", e.target.value, { shouldValidate: true });
                            setValue("manufacturer", ""); // Reset manufacturer when device changes
                        }}
                    >
                        <option value="">Select Device</option>
                        <option value="PC">PC</option>
                        <option value="PHONE">PHONE</option>
                        <option value="TABLETS">TABLETS</option>
                    </select>
                    {errors.device && (
                        <p className="text-red-500 text-xs mt-1">
                            {errors.device.message}
                        </p>
                    )}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">
                        Manufacturer
                    </label>
                    <select
                        {...register("manufacturer")}
                        disabled={!watchDevice}
                        className="mt-1 w-full rounded-md border p-2 focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                    >
                        <option value="">Select Manufacturer</option>
                        {watchDevice && deviceManufacturers[watchDevice]?.map((m) => (
                            <option key={m} value={m}>{m}</option>
                        ))}
                    </select>
                    {errors.manufacturer && (
                        <p className="text-red-500 text-xs mt-1">
                            {errors.manufacturer.message}
                        </p>
                    )}
                </div>
            </div>

            {/* =====================
          Serial Number
      ====================== */}
            <div>
                <label className="block text-sm font-medium text-gray-700">
                    Serial Number / Service Tag
                </label>
                <input
                    {...register("serialNumber")}
                    placeholder="e.g. SN123456789"
                    className="mt-1 w-full rounded-md border p-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
                {errors.serialNumber && (
                    <p className="text-red-500 text-xs mt-1">
                        {errors.serialNumber.message}
                    </p>
                )}
            </div>

            {/* =====================
          Task Title
      ====================== */}
            <div>
                <label className="block text-sm font-medium text-gray-700">
                    Task Title
                </label>
                <input
                    {...register("title")}
                    placeholder="e.g. Wi-Fi connection issue"
                    className="mt-1 w-full rounded-md border p-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
                {errors.title && (
                    <p className="text-red-500 text-xs mt-1">
                        {errors.title.message}
                    </p>
                )}
            </div>

            {/* =====================
          Description
      ====================== */}
            <div>
                <label className="block text-sm font-medium text-gray-700">
                    Problem Description
                </label>
                <textarea
                    {...register("description")}
                    rows={3}
                    placeholder="Describe the issue..."
                    className="mt-1 w-full rounded-md border p-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
                {errors.description && (
                    <p className="text-red-500 text-xs mt-1">
                        {errors.description.message}
                    </p>
                )}
            </div>

            {/* =====================
          Submit
      ====================== */}
            <Button
                type="submit"
                loading={isSubmitting}
                className="w-full rounded-md bg-indigo-600 py-2 text-white font-medium hover:bg-indigo-700 transition disabled:opacity-50"
            >
                Create Task
            </Button>
        </form>
    );
}
