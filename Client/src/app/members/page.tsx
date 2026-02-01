"use client";

import { useEffect } from "react";
import TaskList from "@/components/members/task-list";
import RegisterStudentForm from "@/components/members/register-student-form";
import CreateTaskForm from "@/components/members/create-task-form";
import { useTaskStore } from "@/store/useTaskStore";
import { Skeleton } from "@/components/ui/skeleton";

export default function MemberDashboard() {
    const { tasks, getTasks, isLoading, error } = useTaskStore();

    useEffect(() => {
        getTasks();
    }, [getTasks]);

    if (error) {
        return <div className="text-red-500">Error loading tasks: {error}</div>;
    }

    return (
        <div className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div>
                    <RegisterStudentForm />
                </div>
                <div>
                    <CreateTaskForm />
                </div>
            </div>

            <div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">My Tasks</h3>
                {isLoading ? (
                    <div className="space-y-4">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="p-6 bg-white rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between">
                                <div className="space-y-3">
                                    <Skeleton className="h-6 w-48" />
                                    <Skeleton className="h-4 w-64" />
                                </div>
                                <Skeleton className="h-10 w-32 rounded-xl" />
                            </div>
                        ))}
                    </div>
                ) : (
                    <TaskList tasks={tasks} role="MEMBER" />
                )}
            </div>
        </div>
    );
}
