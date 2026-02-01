"use client";

import { useEffect, useState } from "react";
import { format, addDays, isSameDay, subDays, isAfter, isBefore, startOfDay, endOfDay } from "date-fns";
import { useShiftStore } from "@/store/useShiftStore";
import { useMemberStore } from "@/store/useMemberStore";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { CheckCircle2, XCircle, Clock, Calendar as CalendarIcon, Search, User as UserIcon, RefreshCcw, Filter, UserCog, History, ChevronRight, ChevronLeft, Download } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "sonner";

export default function AdminAttendancePage() {
    const { shifts, isLoading, fetchShifts, updateShift } = useShiftStore();
    const { members, fetchMembers } = useMemberStore();

    // Daily view state
    const [selectedDailyDate, setSelectedDailyDate] = useState(new Date().toISOString().split('T')[0]);
    const [dailySearch, setDailySearch] = useState("");

    // History view filters
    const [historySearch, setHistorySearch] = useState("");
    const [statusFilter, setStatusFilter] = useState<string>("all");
    const [dateFrom, setDateFrom] = useState<string>(format(subDays(new Date(), 30), 'yyyy-MM-dd'));
    const [dateTo, setDateTo] = useState<string>(format(new Date(), 'yyyy-MM-dd'));

    useEffect(() => {
        fetchMembers();
        // Fetch a broad range for initial view
        const start = subDays(new Date(), 90).toISOString();
        const end = addDays(new Date(), 30).toISOString();
        fetchShifts(start, end);
    }, [fetchShifts, fetchMembers]);

    // Filtering logic for Daily Tracking
    const dailyFilteredShifts = shifts.filter(s =>
        (s.user?.name?.toLowerCase().includes(dailySearch.toLowerCase()) ||
            s.user?.email?.toLowerCase().includes(dailySearch.toLowerCase())) &&
        isSameDay(new Date(s.date), new Date(selectedDailyDate))
    );

    // Filtering logic for History
    const historyFilteredShifts = shifts
        .filter(s => {
            const matchesSearch = s.user?.name?.toLowerCase().includes(historySearch.toLowerCase()) ||
                s.user?.email?.toLowerCase().includes(historySearch.toLowerCase());

            const matchesStatus = statusFilter === "all" ||
                (statusFilter === 'PENDING' ? (s.status === 'PENDING' || s.status === 'ASSIGNED') : s.status === statusFilter);

            const shiftDate = new Date(s.date);
            const fromDate = startOfDay(new Date(dateFrom));
            const toDate = endOfDay(new Date(dateTo));
            const matchesDate = (isAfter(shiftDate, fromDate) || isSameDay(shiftDate, fromDate)) &&
                (isBefore(shiftDate, toDate) || isSameDay(shiftDate, toDate));

            return matchesSearch && matchesStatus && matchesDate;
        })
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    const handleAttendance = async (id: string, status: string) => {
        await updateShift(id, { status });
    };

    const setQuickDateRange = (days: number) => {
        const to = new Date();
        const from = subDays(to, days);
        setDateTo(format(to, 'yyyy-MM-dd'));
        setDateFrom(format(from, 'yyyy-MM-dd'));
    };

    return (
        <div className="container mx-auto py-8 px-4 max-w-7xl">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 dark:text-white flex items-center gap-3">
                        <UserCog className="w-8 h-8 text-indigo-600" />
                        Attendance Center
                    </h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-1">Manage member shifts and track attendance history with ease.</p>
                </div>
            </div>

            <Tabs defaultValue="daily" className="space-y-6">
                <TabsList className="bg-slate-100 dark:bg-slate-800/50 p-1 rounded-xl w-fit">
                    <TabsTrigger value="daily" className="rounded-lg px-8 py-2.5 transition-all text-sm font-medium data-[state=active]:bg-white dark:data-[state=active]:bg-indigo-600 data-[state=active]:shadow-md">
                        <CheckCircle2 className="w-4 h-4 mr-2" />
                        Daily Tracking
                    </TabsTrigger>
                    <TabsTrigger value="history" className="rounded-lg px-8 py-2.5 transition-all text-sm font-medium data-[state=active]:bg-white dark:data-[state=active]:bg-indigo-600 data-[state=active]:shadow-md">
                        <History className="w-4 h-4 mr-2" />
                        Full History
                    </TabsTrigger>
                </TabsList>

                {/* DAILY TRACKING TAB */}
                <TabsContent value="daily" className="space-y-6 outline-none animate-in fade-in slide-in-from-bottom-2 duration-300">
                    <Card className="border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden">
                        <CardHeader className="pb-4 bg-slate-50/50 dark:bg-slate-900/50 border-b border-slate-100 dark:border-slate-800">
                            <div className="flex items-center justify-between">
                                <Badge variant="secondary" className="px-3 py-1 bg-indigo-50 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400 border-indigo-100 dark:border-indigo-800/50 font-semibold uppercase tracking-wider text-[10px]">
                                    {dailyFilteredShifts.length} Shifts Scheduled
                                </Badge>
                            </div>
                        </CardHeader>
                        <CardContent className="p-0">
                            <ScrollArea className="h-[550px]">
                                {isLoading ? (
                                    <div className="flex flex-col items-center justify-center py-32 gap-4 text-slate-400">
                                        <RefreshCcw className="w-10 h-10 animate-spin text-indigo-500" />
                                        <p className="font-medium animate-pulse">Loading scheduled shifts...</p>
                                    </div>
                                ) : dailyFilteredShifts.length > 0 ? (
                                    <div className="divide-y divide-slate-100 dark:divide-slate-800">
                                        {dailyFilteredShifts.map((shift) => (
                                            <div key={shift.id} className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-5 hover:bg-slate-50/80 dark:hover:bg-slate-800/30 transition-all group">
                                                <div className="flex items-center gap-4">
                                                    <div className="relative">
                                                        <div className="h-12 w-12 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400 font-bold overflow-hidden border-2 border-white dark:border-slate-700 shadow-sm">
                                                            {shift.user?.profileImage ? (
                                                                <img src={shift.user.profileImage} alt="" className="h-full w-full object-cover" />
                                                            ) : (
                                                                shift.user?.name?.charAt(0) || <UserIcon className="w-6 h-6" />
                                                            )}
                                                        </div>
                                                        <div className={`absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full border-2 border-white dark:border-slate-900 ${shift.status === 'PRESENT' ? 'bg-green-500' : shift.status === 'ABSENT' ? 'bg-red-500' : 'bg-slate-300'
                                                            }`} />
                                                    </div>
                                                    <div>
                                                        <h3 className="font-bold text-slate-900 dark:text-slate-100 group-hover:text-indigo-600 transition-colors">
                                                            {shift.user?.name || "Unassigned"}
                                                        </h3>
                                                        <p className="text-xs text-slate-500 mb-1">{shift.user?.email}</p>
                                                        <div className="flex items-center gap-3">
                                                            <span className="flex items-center gap-1 text-xs font-medium text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded">
                                                                <Clock className="w-3 h-3 text-indigo-500" />
                                                                {shift.startTime} - {shift.endTime}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="flex items-center gap-3">
                                                    <Button
                                                        variant={shift.status === 'PRESENT' ? 'default' : 'outline'}
                                                        size="sm"
                                                        className={`gap-2 h-10 px-6 rounded-lg font-medium transition-all ${shift.status === 'PRESENT'
                                                            ? 'bg-green-600 hover:bg-green-700 border-green-600 text-white shadow-lg shadow-green-500/20'
                                                            : 'hover:border-green-600 hover:text-green-600'
                                                            }`}
                                                        onClick={() => handleAttendance(shift.id, 'PRESENT')}
                                                    >
                                                        <CheckCircle2 className="w-4 h-4" />
                                                        Present
                                                    </Button>
                                                    <Button
                                                        variant={shift.status === 'ABSENT' ? 'default' : 'outline'}
                                                        size="sm"
                                                        className={`gap-2 h-10 px-6 rounded-lg font-medium transition-all ${shift.status === 'ABSENT'
                                                            ? 'bg-red-600 hover:bg-red-700 border-red-600 text-white shadow-lg shadow-red-500/20'
                                                            : 'hover:border-red-600 hover:text-red-600'
                                                            }`}
                                                        onClick={() => handleAttendance(shift.id, 'ABSENT')}
                                                    >
                                                        <XCircle className="w-4 h-4" />
                                                        Absent
                                                    </Button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="flex flex-col items-center justify-center py-32 text-slate-400">
                                        <CalendarIcon className="w-16 h-16 mb-4 opacity-10" />
                                        <p className="font-semibold text-lg">No shifts scheduled for this date</p>
                                    </div>
                                )}
                            </ScrollArea>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* FULL HISTORY TAB */}
                <TabsContent value="history" className="space-y-6 outline-none animate-in fade-in slide-in-from-bottom-2 duration-300">
                    <Card className="border-slate-200 dark:border-slate-800 shadow-sm overflow-visible">
                        <CardHeader className="pb-0">
                            <div className="flex flex-col gap-6">
                                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pb-6">
                                    <div className="space-y-2">
                                        <Label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Search</Label>
                                        <div className="relative">
                                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                            <Input
                                                placeholder="Name or email..."
                                                value={historySearch}
                                                onChange={(e) => setHistorySearch(e.target.value)}
                                                className="pl-10"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</Label>
                                        <Select value={statusFilter} onValueChange={setStatusFilter}>
                                            <SelectTrigger>
                                                <Filter className="w-4 h-4 mr-2 text-slate-400" />
                                                <SelectValue placeholder="All Status" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="all">All Status</SelectItem>
                                                <SelectItem value="PRESENT">Present</SelectItem>
                                                <SelectItem value="ABSENT">Absent</SelectItem>
                                                <SelectItem value="PENDING">Pending</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div className="md:col-span-2 space-y-2">
                                        <Label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Date Range</Label>
                                        <div className="flex items-center gap-2">
                                            <div className="relative flex-1">
                                                <Input
                                                    type="date"
                                                    value={dateFrom}
                                                    onChange={(e) => setDateFrom(e.target.value)}
                                                    className="pl-10"
                                                />
                                                <CalendarIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                            </div>
                                            <span className="text-slate-400">to</span>
                                            <div className="relative flex-1">
                                                <Input
                                                    type="date"
                                                    value={dateTo}
                                                    onChange={(e) => setDateTo(e.target.value)}
                                                    className="pl-10"
                                                />
                                                <CalendarIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                            </div>
                                        </div>
                                        <div className="flex gap-2 pt-1">
                                            {[7, 30, 90].map(days => (
                                                <Button
                                                    key={days}
                                                    variant="ghost"
                                                    size="sm"
                                                    className="h-7 text-[10px] px-2 text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50"
                                                    onClick={() => setQuickDateRange(days)}
                                                >
                                                    Last {days}d
                                                </Button>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="p-0 border-t border-slate-100 dark:border-slate-800">
                            <ScrollArea className="h-[600px]">
                                <Table>
                                    <TableHeader className="bg-slate-50 dark:bg-slate-900 sticky top-0 z-10 shadow-sm">
                                        <TableRow>
                                            <TableHead className="w-[300px]">Member</TableHead>
                                            <TableHead>Date</TableHead>
                                            <TableHead>Time Range</TableHead>
                                            <TableHead className="text-right">Attendance Status</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {historyFilteredShifts.length > 0 ? (
                                            historyFilteredShifts.map((shift) => (
                                                <TableRow key={shift.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 group">
                                                    <TableCell>
                                                        <div className="flex items-center gap-3">
                                                            <div className="h-8 w-8 rounded-full bg-slate-100 dark:bg-slate-800 border flex items-center justify-center text-[10px] font-bold overflow-hidden shadow-sm">
                                                                {shift.user?.profileImage ? (
                                                                    <img src={shift.user.profileImage} alt="" className="h-full w-full object-cover" />
                                                                ) : (
                                                                    shift.user?.name?.charAt(0) || <UserIcon className="w-4 h-4" />
                                                                )}
                                                            </div>
                                                            <div className="flex flex-col">
                                                                <span className="font-bold text-slate-800 dark:text-slate-200">
                                                                    {shift.user?.name || "Unassigned"}
                                                                </span>
                                                                <span className="text-[10px] text-slate-500">{shift.user?.email}</span>
                                                            </div>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell className="font-medium">
                                                        {format(new Date(shift.date), 'EEE, MMM d, yyyy')}
                                                    </TableCell>
                                                    <TableCell>
                                                        <div className="flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-400">
                                                            <Clock className="w-3.5 h-3.5 text-slate-400" />
                                                            {shift.startTime} - {shift.endTime}
                                                        </div>
                                                    </TableCell>
                                                    <TableCell className="text-right">
                                                        <Select
                                                            defaultValue={shift.status === 'ASSIGNED' ? 'PENDING' : shift.status}
                                                            onValueChange={(val) => handleAttendance(shift.id, val as "PRESENT" | "ABSENT")}
                                                        >
                                                            <SelectTrigger className={`w-[130px] ml-auto h-8 text-[11px] font-bold uppercase tracking-wider border-0 ${shift.status === 'PRESENT' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
                                                                shift.status === 'ABSENT' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' :
                                                                    'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                                                                }`}>
                                                                <SelectValue />
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                <SelectItem value="PENDING">Pending</SelectItem>
                                                                <SelectItem value="PRESENT">Present</SelectItem>
                                                                <SelectItem value="ABSENT">Absent</SelectItem>
                                                            </SelectContent>
                                                        </Select>
                                                    </TableCell>
                                                </TableRow>
                                            ))
                                        ) : (
                                            <TableRow>
                                                <TableCell colSpan={4} className="text-center py-20 text-slate-400 italic">
                                                    <Search className="w-12 h-12 mx-auto mb-3 opacity-10" />
                                                    No history records match your filters.
                                                </TableCell>
                                            </TableRow>
                                        )}
                                    </TableBody>
                                </Table>
                            </ScrollArea>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}
