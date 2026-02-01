"use client";

import { useState, useEffect } from "react";
import { useTaskStore, Task, TaskStatus } from "@/store/useTaskStore";
import { toast } from "sonner";

export default function StudentServiceView() {
    const { tasks, getTasks } = useTaskStore();
    const [selectedTask, setSelectedTask] = useState<Task | null>(null);

    useEffect(() => {
        getTasks(); // Fetch all tasks for the student
    }, []);

    

    return (
        <div className="p-4 md:p-6 bg-gray-50 min-h-screen">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">My Tasks / Services</h2>

            <div className="overflow-x-auto custom-scrollbar bg-white rounded-lg shadow-md border">
                <table className="w-full min-w-[800px] divide-y divide-gray-200">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
                                Title
                            </th>
                            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
                                Service Provider
                            </th>

                            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
                                Created
                            </th>
                            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
                                Status
                            </th>

                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {tasks.length === 0 && (
                            <tr>
                                <td colSpan={4} className="text-center py-4 text-gray-500">
                                    No tasks assigned.
                                </td>
                            </tr>
                        )}

                        {tasks.map((task) => (
                            <tr key={task.id}>
                                <td className="px-6 py-3 text-gray-700">{task.title}</td>
                                <td className="px-6 py-3 text-gray-600 truncate max-w-xs">{task.member?.name}</td>
                                <td className="px-6 py-3 text-gray-500">{new Date(task.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</td>

                                <td className="px-6 py-3">
                                    <span
                                        className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide
                      ${task.status === "PENDING" ? "bg-yellow-100 text-yellow-800" : ""}
                      ${task.status === "IN_PROGRESS" ? "bg-blue-100 text-blue-800" : ""}
                      ${task.status === "COMPLETED" ? "bg-green-100 text-green-800" : ""}
                    `}
                                    >
                                        {task.status.replace("_", " ")}
                                    </span>
                                </td>

                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

           
        </div>
    );
}
