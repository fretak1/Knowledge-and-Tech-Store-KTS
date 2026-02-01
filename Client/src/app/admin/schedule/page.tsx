"use client";

import { useEffect, useState } from "react";
import { useShiftStore } from "@/store/useShiftStore";
import { useMemberStore } from "@/store/useMemberStore";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Clock, User as UserIcon, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";

const DAYS_OF_WEEK = [
    { id: 1, name: "Monday" },
    { id: 2, name: "Tuesday" },
    { id: 3, name: "Wednesday" },
    { id: 4, name: "Thursday" },
    { id: 5, name: "Friday" },
    { id: 6, name: "Saturday" },
    { id: 0, name: "Sunday" },
];

export default function AdminSchedulePage() {
    const {
        recurringShifts,
        isLoading,
        fetchRecurringShifts,
        createRecurringShift,
        deleteRecurringShift,
    } = useShiftStore();
    const { members, fetchMembers } = useMemberStore();

    // Dialog states
    const [isAddOpen, setIsAddOpen] = useState(false);
    const [selectedDayId, setSelectedDayId] = useState<number | null>(null);
    const [newShift, setNewShift] = useState({
        startTime: "08:00",
        endTime: "11:00",
        userId: "unassigned"
    });

    useEffect(() => {
        fetchMembers();
        fetchRecurringShifts();
    }, [fetchMembers, fetchRecurringShifts]);

    const handleDeleteShift = async (id: string) => {
        const success = await deleteRecurringShift(id);
        if (success) {
            toast.success("Shift removed successfully");
        } else {
            toast.error("Failed to remove shift");
        }
    };

    const handleCreateShift = async () => {
        if (selectedDayId === null) return;
        if (newShift.userId === "unassigned") return; // Should validate better

        const success = await createRecurringShift({
            dayOfWeek: selectedDayId,
            startTime: newShift.startTime,
            endTime: newShift.endTime,
            userId: newShift.userId
        });

        if (success) {
            toast.success("Member assigned successfully");
            setIsAddOpen(false);
            setNewShift({ startTime: "08:00", endTime: "11:00", userId: "unassigned" });
        } else {
            toast.error("Failed to assign member");
        }
    };

    return (
        <div className="container mx-auto py-8 px-4 max-w-7xl">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Weekly  Configuration</h1>
                <p className="text-slate-500 dark:text-slate-400">
                    Define the fixed schedule for each day of the week. This  will repeat automatically every week.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {DAYS_OF_WEEK.map((day) => {
                    const dayShifts = recurringShifts.filter(s => s.dayOfWeek === day.id);

                    return (
                        <Card key={day.id} className="flex flex-col h-full border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow">
                            <CardHeader className="pb-3 bg-slate-50 dark:bg-slate-900/50 rounded-t-xl border-b border-slate-100 dark:border-slate-800">
                                <CardTitle className="text-lg font-bold text-slate-800 dark:text-slate-200">
                                    {day.name}
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="flex-1 p-4 flex flex-col gap-3">
                                <ScrollArea className="flex-1 -mx-2 px-2 min-h-[150px]">
                                    <div className="space-y-3">
                                        {dayShifts.map((shift) => (
                                            <div key={shift.id} className="relative group bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-3 shadow-sm">
                                                <div className="flex items-center justify-between mb-2">
                                                    <div className="flex items-center text-xs font-semibold text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-900 px-2 py-1 rounded">
                                                        <Clock className="w-3 h-3 mr-1" />
                                                        {shift.startTime} - {shift.endTime}
                                                    </div>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-6 w-6 text-slate-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                                                        onClick={() => handleDeleteShift(shift.id)}
                                                    >
                                                        <Trash2 className="w-3.5 h-3.5" />
                                                    </Button>
                                                </div>

                                                <div className="flex items-center gap-3">
                                                    <div className="h-8 w-8 rounded-full flex items-center justify-center text-xs font-bold bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-300">
                                                        {shift.user?.profileImage ? (
                                                            <img src={shift.user.profileImage} alt="" className="h-full w-full rounded-full object-cover" />
                                                        ) : (
                                                            shift.user?.name?.charAt(0) || 'U'
                                                        )}
                                                    </div>
                                                    <div className="text-sm font-medium text-slate-900 dark:text-slate-100 truncate">
                                                        {shift.user?.name || "Unknown Member"}
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                        {dayShifts.length === 0 && (
                                            <div className="text-center py-8 text-slate-400 text-sm italic border-2 border-dashed border-slate-100 rounded-lg">
                                                No members assigned
                                            </div>
                                        )}
                                    </div>
                                </ScrollArea>

                                <Dialog open={isAddOpen && selectedDayId === day.id} onOpenChange={(open) => {
                                    setIsAddOpen(open);
                                    if (open) setSelectedDayId(day.id);
                                    else setSelectedDayId(null);
                                }}>
                                    <DialogTrigger asChild>
                                        <Button variant="outline" className="w-full border-dashed border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                                            <Plus className="w-4 h-4 mr-2" />
                                            Assign Member
                                        </Button>
                                    </DialogTrigger>
                                    <DialogContent>
                                        <DialogHeader>
                                            <DialogTitle>Assign Member to {day.name}</DialogTitle>
                                        </DialogHeader>
                                        <div className="space-y-4 py-4">
                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="space-y-2">
                                                    <Label>Start Time</Label>
                                                    <Input
                                                        type="time"
                                                        value={newShift.startTime}
                                                        onChange={(e) => setNewShift({ ...newShift, startTime: e.target.value })}
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <Label>End Time</Label>
                                                    <Input
                                                        type="time"
                                                        value={newShift.endTime}
                                                        onChange={(e) => setNewShift({ ...newShift, endTime: e.target.value })}
                                                    />
                                                </div>
                                            </div>
                                            <div className="space-y-2">
                                                <Label>Select Member</Label>
                                                <Select
                                                    value={newShift.userId}
                                                    onValueChange={(val) => setNewShift({ ...newShift, userId: val })}
                                                >
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select a member" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="unassigned">Select a member...</SelectItem>
                                                        {members.map(m => (
                                                            <SelectItem key={m.id} value={m.id}>{m.name}</SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                            <Button
                                                onClick={handleCreateShift}
                                                disabled={newShift.userId === "unassigned"}
                                                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white"
                                            >
                                                Save Assignment
                                            </Button>
                                        </div>
                                    </DialogContent>
                                </Dialog>
                            </CardContent>
                        </Card>
                    );
                })}
            </div>
        </div>
    );
}
