"use client";

import { useState } from 'react';
import { useTaskStore } from '@/store/useTaskStore';
import { toast } from 'sonner';

// Re-using the types for clarity
type Task = {
    id: string;
    title: string;
    description: string;
    status: string;
    createdAt: string;
    student?: { name: string | null; department: string | null; batch: string | null } | null;
};

type TaskStatus = 'PENDING' | 'IN_PROGRESS' | 'COMPLETED';

export default function TaskTable({ tasks, role }: { tasks: Task[]; role: string }) {
    const [updating, setUpdating] = useState<string | null>(null);
    const [selectedTask, setSelectedTask] = useState<Task | null>(null);
    // Assuming useTaskStore and updateTaskStatus are correctly implemented elsewhere
    const { updateTaskStatus } = useTaskStore();

    const handleStatusUpdate = async (taskId: string, newStatus: TaskStatus) => {
        setUpdating(taskId);
        try {
            // Note: This function call depends on the external store logic
            const result = await updateTaskStatus(taskId, newStatus);
            if (result) toast.success('Task updated successfully');
        } catch (error) {
            toast.error('Failed to update task');
            console.error(error);
        } finally {
            setUpdating(null);
        }
    };

    /**
     * Maps task status to professional, distinct color classes.
     */
    const getStatusClasses = (status: TaskStatus) => {
        switch (status) {
            case 'PENDING':
                // Warm, cautionary color
                return 'bg-amber-100 text-amber-700 ring-1 ring-inset ring-amber-200';
            case 'IN_PROGRESS':
                // Neutral, active color
                return 'bg-sky-100 text-sky-700 ring-1 ring-inset ring-sky-200';
            case 'COMPLETED':
                // Success color
                return 'bg-emerald-100 text-emerald-700 ring-1 ring-inset ring-emerald-200';
            default:
                return 'bg-gray-100 text-gray-700';
        }
    };

    return (
        <div>
            {/* Table Container - Added a subtle focus shadow and border-radius */}
            <div className="overflow-x-auto bg-white shadow-xl rounded-xl border border-gray-100">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50/70 border-b border-gray-200">
                        <tr>
                            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">Title</th>
                            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">Student Info</th>
                            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">Created</th>
                            <th className="px-6 py-3 text-right text-sm font-semibold text-gray-600 uppercase tracking-wider"></th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-100">
                        {tasks.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="text-center py-10 text-lg text-gray-400">
                                    <svg className="mx-auto h-8 w-8 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                                        <path vectorEffect="non-scaling-stroke" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 13h6m-3-3v6m-9 1 3 3 7-7-3-3-4 4-3-3z" />
                                    </svg>
                                    <p className='mt-2'>No tasks found</p>
                                </td>
                            </tr>
                        ) : (
                            tasks.map((task) => (
                                // Added a subtle hover effect to table rows
                                <tr key={task.id} className='hover:bg-gray-50 transition-colors'>
                                    <td className="px-6 py-4 font-semibold text-gray-800 truncate max-w-xs">{task.title}</td>
                                    <td className="px-6 py-4 text-sm text-gray-600">
                                        {/* Improved readability of student info */}
                                        <div className='font-medium'>{task.student?.name || 'Unassigned'}</div>
                                        <div className='text-xs text-gray-400'>{task.student?.department || 'N/A'} ({task.student?.batch || 'N/A'})</div>
                                    </td>
                                    <td className="px-6 py-4">
                                        {/* Enhanced status badge styling */}
                                        <span className={`inline-flex items-center rounded-full px-3 py-0.5 text-xs font-medium uppercase ${getStatusClasses(task.status as TaskStatus)}`}>
                                            {task.status.replace('_', ' ')}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-500">
                                        {new Date(task.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                                    </td>
                                    <td className="px-6 py-4 text-right space-x-2">
                                        {/* Primary button style for 'See Details' */}
                                        <button
                                            onClick={() => setSelectedTask(task)}
                                            className="text-xs font-medium bg-indigo-500 hover:bg-indigo-600 text-white px-3 py-1.5 rounded-lg transition-all shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                                        >
                                            View Details
                                        </button>

                                        {/* Action buttons for 'MEMBER' role */}
                                        {role === 'MEMBER' && task.status !== 'COMPLETED' && (
                                            <>
                                                {task.status === 'PENDING' && (
                                                    <button
                                                        onClick={() => handleStatusUpdate(task.id, 'IN_PROGRESS')}
                                                        disabled={updating === task.id}
                                                        className="text-xs font-medium bg-sky-500 hover:bg-sky-600 text-white px-3 py-1.5 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2"
                                                    >
                                                        {updating === task.id ? 'Starting...' : 'Start Task'}
                                                    </button>
                                                )}
                                                <button
                                                    onClick={() => handleStatusUpdate(task.id, 'COMPLETED')}
                                                    disabled={updating === task.id}
                                                    className="text-xs font-medium bg-emerald-500 hover:bg-emerald-600 text-white px-3 py-1.5 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
                                                >
                                                    {updating === task.id ? 'Completing...' : 'Complete Task'}
                                                </button>
                                            </>
                                        )}
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Modal / Dialog - Refined with better background and internal padding/spacing */}
            {selectedTask && (
                <div className="fixed inset-0 bg-gray-900 bg-opacity-75 backdrop-blur-sm flex justify-center items-center z-50 p-4 transition-opacity">
                    <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full p-8 relative transform transition-all scale-100 opacity-100">
                        {/* Close button with a modern icon feel */}
                        <button
                            onClick={() => setSelectedTask(null)}
                            className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 transition-colors p-1 rounded-full hover:bg-gray-100"
                            aria-label="Close"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                        </button>

                        <h2 className="text-2xl font-bold text-gray-900 mb-6 border-b pb-2">{selectedTask.title}</h2>

                        <div className="space-y-4 text-sm">
                            <p className="text-gray-700 leading-relaxed"><span className="font-semibold text-gray-800 block mb-1">Description:</span> {selectedTask.description}</p>

                            <div className='grid grid-cols-2 gap-y-2 gap-x-4'>
                                <p className="text-gray-700"><span className="font-semibold text-gray-800">Student:</span> {selectedTask.student?.name || 'N/A'}</p>
                                <p className="text-gray-700"><span className="font-semibold text-gray-800">Department:</span> {selectedTask.student?.department || 'N/A'}</p>
                                <p className="text-gray-700"><span className="font-semibold text-gray-800">Batch:</span> {selectedTask.student?.batch || 'N/A'}</p>
                                <p className="text-gray-700"><span className="font-semibold text-gray-800">Created At:</span> {new Date(selectedTask.createdAt).toLocaleDateString()}</p>
                            </div>

                            <div className="pt-2">
                                <span className="font-semibold text-gray-800 mr-2">Status:</span>
                                <span className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-medium uppercase ${getStatusClasses(selectedTask.status as TaskStatus)}`}>
                                    {selectedTask.status.replace('_', ' ')}
                                </span>
                            </div>
                        </div>

                    </div>
                </div>
            )}
        </div>
    );
}