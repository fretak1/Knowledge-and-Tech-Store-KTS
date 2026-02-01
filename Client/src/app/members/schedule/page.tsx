"use client";

import { useEffect, useState } from "react";
import { format, addDays, isSameDay, startOfDay, startOfWeek } from "date-fns";
import { useShiftStore } from "@/store/useShiftStore";
import { useAuthStore } from "@/store/useAuthStore";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Clock, Calendar as CalendarIcon, User as UserIcon, CheckCircle2, XCircle, AlertCircle } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export default function MemberSchedulePage() {
    const { shifts, fetchShifts } = useShiftStore();
    const { user } = useAuthStore();
    const [startDate] = useState(startOfWeek(new Date(), { weekStartsOn: 1 }));

    useEffect(() => {
        // Fetch current week plus some history/future for tabs
        const start = addDays(startDate, -7);
        const end = addDays(startDate, 14);
        fetchShifts(start.toISOString(), end.toISOString());
    }, [fetchShifts, startDate]);

    const days = Array.from({ length: 7 }).map((_, i) => addDays(startDate, i));
    const myHistory = shifts
        .filter(s => s.userId === user?.id && new Date(s.date) < startOfDay(new Date()))
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    return (
        <div className="container mx-auto py-8 px-4 max-w-7xl">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Attendance & Schedule</h1>
                <p className="text-slate-500 dark:text-slate-400">View your assigned shifts and track your attendance history.</p>
            </div>

            <Tabs defaultValue="schedule" className="space-y-6">
                <TabsList className="bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
                    <TabsTrigger value="schedule" className="rounded-lg px-6 py-2 transition-all data-[state=active]:bg-white dark:data-[state=active]:bg-indigo-600 data-[state=active]:shadow-sm">
                        Weekly Schedule
                    </TabsTrigger>
                    <TabsTrigger value="history" className="rounded-lg px-6 py-2 transition-all data-[state=active]:bg-white dark:data-[state=active]:bg-indigo-600 data-[state=active]:shadow-sm">
                        Attendance History
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="schedule" className="mt-0 outline-none">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {days.map((day) => {
                            const dayShifts = shifts.filter(s => isSameDay(new Date(s.date), day));
                            const isToday = isSameDay(day, new Date());
                            dayShifts.sort((a, b) => a.startTime.localeCompare(b.startTime));
                            const myShiftToday = dayShifts.find(s => s.userId === user?.id);

                            return (
                                <Card key={day.toISOString()} className={`flex flex-col h-full 
                                    ${isToday ? 'border-indigo-500 ring-1 ring-indigo-500' : ''}
                                    ${myShiftToday ? 'bg-indigo-50/10 dark:bg-indigo-950/10' : ''}
                                `}>
                                    <CardHeader className="pb-3 bg-slate-50 dark:bg-slate-900/50 rounded-t-xl border-b border-slate-100 dark:border-slate-800">
                                        <CardTitle className="flex items-center justify-between text-base">
                                            <span className={`font-semibold ${isToday ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-700 dark:text-slate-300'}`}>
                                                {format(day, 'EEEE')}
                                            </span>
                                            <span className="text-sm font-normal text-slate-500">
                                                {format(day, 'MMM d')}
                                            </span>
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="flex-1 p-4">
                                        <ScrollArea className="flex-1 -mx-2 px-2">
                                            <div className="space-y-3">
                                                {dayShifts.map((shift) => {
                                                    const isMyShift = shift.userId === user?.id;
                                                    return (
                                                        <div key={shift.id} className={`
                                                            relative border rounded-lg p-3 shadow-sm transition-all
                                                            ${isMyShift
                                                                ? 'bg-indigo-600 text-white border-indigo-600'
                                                                : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700'}
                                                        `}>
                                                            <div className="flex items-start justify-between mb-2">
                                                                <div className={`flex items-center text-sm font-medium ${isMyShift ? 'text-indigo-100' : 'text-slate-700 dark:text-slate-300'}`}>
                                                                    <Clock className={`w-3.5 h-3.5 mr-1.5 ${isMyShift ? 'text-indigo-200' : 'text-indigo-500'}`} />
                                                                    {shift.startTime} - {shift.endTime}
                                                                </div>
                                                            </div>

                                                            <div className="flex items-center justify-between gap-2">
                                                                <div className="flex items-center gap-2">
                                                                    <div className={`
                                                                        h-6 w-6 rounded-full flex items-center justify-center text-[10px] font-bold border
                                                                        ${isMyShift
                                                                            ? 'bg-indigo-500 text-white border-indigo-400'
                                                                            : (shift.user
                                                                                ? 'bg-slate-100 text-slate-500 border-slate-200 dark:bg-slate-700 dark:text-slate-300 dark:border-slate-600'
                                                                                : 'bg-slate-50 text-slate-300 border-dashed border-slate-200 dark:bg-slate-800 dark:text-slate-600')}
                                                                    `}>
                                                                        {shift.user ? (
                                                                            shift.user.profileImage ? (
                                                                                <img src={shift.user.profileImage} alt="" className="h-full w-full rounded-full object-cover" />
                                                                            ) : (
                                                                                shift.user.name?.charAt(0) || 'U'
                                                                            )
                                                                        ) : (
                                                                            <UserIcon className="w-3 h-3" />
                                                                        )}
                                                                    </div>
                                                                    <span className={`text-sm block truncate ${isMyShift ? 'text-white' : 'text-slate-600 dark:text-slate-400'}`}>
                                                                        {isMyShift ? "My Shift" : (shift.user ? shift.user.name : "Unassigned")}
                                                                    </span>
                                                                </div>

                                                                {isMyShift && (
                                                                    <div className="flex items-center">
                                                                        {shift.status === 'PRESENT' ? (
                                                                            <Badge className="bg-green-500/20 text-green-100 border-green-500/20 h-5 px-1.5 text-[10px] gap-1">
                                                                                <CheckCircle2 className="w-3 h-3" /> Present
                                                                            </Badge>
                                                                        ) : shift.status === 'ABSENT' ? (
                                                                            <Badge className="bg-red-500/20 text-red-100 border-red-500/20 h-5 px-1.5 text-[10px] gap-1">
                                                                                <XCircle className="w-3 h-3" /> Absent
                                                                            </Badge>
                                                                        ) : (
                                                                            <Badge variant="outline" className="border-white/30 text-white/70 h-5 px-1.5 text-[10px] gap-1">
                                                                                <AlertCircle className="w-3 h-3" /> Pending
                                                                            </Badge>
                                                                        )}
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>
                                                    );
                                                })}
                                                {dayShifts.length === 0 && (
                                                    <div className="text-center py-6 text-slate-400 text-xs italic">
                                                        No shifts
                                                    </div>
                                                )}
                                            </div>
                                        </ScrollArea>
                                    </CardContent>
                                </Card>
                            );
                        })}
                    </div>
                </TabsContent>

                <TabsContent value="history" className="mt-0 outline-none">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">Your Attendance History</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {myHistory.length > 0 ? (
                                <div className="overflow-x-auto custom-scrollbar">
                                    <Table className="min-w-[600px]">
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>Date</TableHead>
                                                <TableHead>Shift Time</TableHead>
                                                <TableHead>Status</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {myHistory.map((shift) => (
                                                <TableRow key={shift.id}>
                                                    <TableCell className="font-medium">{format(new Date(shift.date), 'PPP')}</TableCell>
                                                    <TableCell>{shift.startTime} - {shift.endTime}</TableCell>
                                                    <TableCell>
                                                        {shift.status === 'PRESENT' ? (
                                                            <Badge className="bg-green-100 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-400">
                                                                PRESENT
                                                            </Badge>
                                                        ) : shift.status === 'ABSENT' ? (
                                                            <Badge className="bg-red-100 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-400">
                                                                ABSENT
                                                            </Badge>
                                                        ) : (
                                                            <Badge variant="outline" className="text-slate-500 border-slate-200">
                                                                PENDING
                                                            </Badge>
                                                        )}
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </div>
                            ) : (
                                <div className="text-center py-12 text-slate-400">
                                    <AlertCircle className="w-12 h-12 mx-auto mb-4 opacity-20" />
                                    <p>No attendance history found for the last 30 days.</p>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}

