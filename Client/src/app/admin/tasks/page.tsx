"use client";

import { useEffect } from "react";
import { useTaskStore } from "@/store/useTaskStore";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
    Laptop,
    Smartphone,
    Tablet,
    Clock,
    CheckCircle2,
    AlertCircle,
    User,
    Tag,
    History,
    Search,
    Calendar as CalendarIcon,
    X
} from "lucide-react";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format, isWithinInterval, startOfDay, endOfDay, subDays, formatDistanceToNow, subMonths, subYears } from "date-fns";
import { DateRange } from "react-day-picker";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

export default function AdminTasksPage() {
    const { tasks, getTasks, isLoading, error } = useTaskStore();

    // Filter States
    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState<string>("ALL");
    const [deviceFilter, setDeviceFilter] = useState<string>("ALL");
    const [dateRange, setDateRange] = useState<DateRange | undefined>();
    const [datePreset, setDatePreset] = useState<string>("ALL");

    useEffect(() => {
        getTasks();
    }, [getTasks]);

    const getStatusColor = (status: string) => {
        switch (status) {
            case "PENDING": return "bg-yellow-100 text-yellow-800 border-yellow-200";
            case "IN_PROGRESS": return "bg-blue-100 text-blue-800 border-blue-200";
            case "COMPLETED": return "bg-green-100 text-green-800 border-green-200";
            default: return "bg-gray-100 text-gray-800 border-gray-200";
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case "PENDING": return <AlertCircle className="h-4 w-4" />;
            case "IN_PROGRESS": return <Clock className="h-4 w-4" />;
            case "COMPLETED": return <CheckCircle2 className="h-4 w-4" />;
            default: return null;
        }
    };

    const getDeviceIcon = (device: string) => {
        switch (device.toUpperCase()) {
            case "PC": return <Laptop className="h-5 w-5 text-indigo-600" />;
            case "PHONE": return <Smartphone className="h-5 w-5 text-indigo-600" />;
            case "TABLETS": return <Tablet className="h-5 w-5 text-indigo-600" />;
            default: return <Laptop className="h-5 w-5 text-indigo-600" />;
        }
    };



    const handlePresetChange = (value: string) => {
        setDatePreset(value);
        const today = new Date();

        switch (value) {
            case "LAST_7_DAYS":
                setDateRange({ from: subDays(today, 7), to: today });
                break;
            case "LAST_30_DAYS":
                setDateRange({ from: subDays(today, 30), to: today });
                break;
            case "LAST_3_MONTHS":
                setDateRange({ from: subMonths(today, 3), to: today });
                break;
            case "LAST_6_MONTHS":
                setDateRange({ from: subMonths(today, 6), to: today });
                break;
            case "LAST_YEAR":
                setDateRange({ from: subYears(today, 1), to: today });
                break;
            case "ALL":
                setDateRange(undefined);
                break;
            default:
                break;
        }
    };

    // When manually selecting dates, set preset to CUSTOM if it doesn't match a preset (simplified: just set to CUSTOM on any manual change)
    const handleDateSelect = (range: DateRange | undefined) => {
        setDateRange(range);
        if (range) {
            setDatePreset("CUSTOM");
        } else {
            setDatePreset("ALL");
        }
    };

    // Filter Logic
    const filteredTasks = tasks.filter((task) => {
        // Search Filter
        const query = searchQuery.toLowerCase();
        const matchesSearch =
            task.title.toLowerCase().includes(query) ||
            task.description.toLowerCase().includes(query) ||
            task.serialNumber.toLowerCase().includes(query) ||
            task.member?.name?.toLowerCase().includes(query);

        // Status Filter
        const matchesStatus = statusFilter === "ALL" || task.status === statusFilter;

        // Device Filter
        const matchesDevice = deviceFilter === "ALL" || task.device === deviceFilter;

        // Date Range Filter
        let matchesDate = true;
        if (dateRange?.from) {
            const taskDate = new Date(task.createdAt);
            const start = startOfDay(dateRange.from);
            const end = dateRange.to ? endOfDay(dateRange.to) : endOfDay(dateRange.from);
            matchesDate = isWithinInterval(taskDate, { start, end });

    
        }

        return matchesSearch && matchesStatus && matchesDevice && matchesDate;
    });

    const clearFilters = () => {
        setSearchQuery("");
        setStatusFilter("ALL");
        setDeviceFilter("ALL");
        setDateRange(undefined);
        setDatePreset("ALL");
    };

    if (error) {
        return (
            <div className="p-8 text-center bg-red-50 rounded-2xl border border-red-100 text-red-600">
                <AlertCircle className="h-12 w-12 mx-auto mb-4" />
                <h3 className="text-lg font-bold">Error loading tasks</h3>
                <p>{error}</p>
            </div>
        );
    }

    return (
        <div className="space-y-8 p-4 md:p-8 bg-gray-50/50 min-h-screen">
            <header className="flex flex-col gap-6 border-b border-gray-200 pb-8">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="text-center md:text-left">
                        <h1 className="text-2xl md:text-3xl font-black text-gray-900 tracking-tight">System Tasks</h1>
                        <p className="text-sm text-gray-500 font-medium">Monitor and manage all service requests across the platform.</p>
                    </div>
                    <div className="flex items-center justify-center md:justify-start gap-3">
                        <Badge variant="outline" className="bg-white px-4 py-1.5 rounded-xl border-gray-200 text-gray-600 font-bold shadow-sm">
                            Total: {filteredTasks.length} <span className="text-gray-400 font-normal ml-1">/ {tasks.length}</span>
                        </Badge>
                    </div>
                </div>

                {/* Filters Section */}
                <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3">
                    {/* Search */}
                    <div className="relative lg:col-span-2">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                            placeholder="Search tasks, serial numbers, Member name..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-9 bg-gray-50/50 border-gray-200 focus-visible:ring-indigo-500 rounded-xl"
                        />
                    </div>

                    {/* Status Select */}
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                        <SelectTrigger className="bg-gray-50/50 border-gray-200 rounded-xl">
                            <SelectValue placeholder="Status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="ALL">All Status</SelectItem>
                            <SelectItem value="PENDING">Pending</SelectItem>
                            <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                            <SelectItem value="COMPLETED">Completed</SelectItem>
                        </SelectContent>
                    </Select>

                    {/* Device Select */}
                    <Select value={deviceFilter} onValueChange={setDeviceFilter}>
                        <SelectTrigger className="bg-gray-50/50 border-gray-200 rounded-xl">
                            <SelectValue placeholder="Device" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="ALL">All Devices</SelectItem>
                            <SelectItem value="PC">PC</SelectItem>
                            <SelectItem value="PHONE">Phone</SelectItem>
                            <SelectItem value="TABLETS">Tablet</SelectItem>
                        </SelectContent>
                    </Select>

                    {/* Date Preset Select */}
                    <Select value={datePreset} onValueChange={handlePresetChange}>
                        <SelectTrigger className="bg-gray-50/50 border-gray-200 rounded-xl">
                            <SelectValue placeholder="Date Range" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="ALL">All Time</SelectItem>
                            <SelectItem value="LAST_7_DAYS">Last 7 Days</SelectItem>
                            <SelectItem value="LAST_30_DAYS">Last 30 Days</SelectItem>
                            <SelectItem value="LAST_3_MONTHS">Last 3 Months</SelectItem>
                            <SelectItem value="LAST_6_MONTHS">Last 6 Months</SelectItem>
                            <SelectItem value="LAST_YEAR">Last Year</SelectItem>
                            <SelectItem value="CUSTOM">Custom Range</SelectItem>
                        </SelectContent>
                    </Select>

                    {/* Date Range Picker */}
                    <div className="flex gap-2">
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button
                                    variant={"outline"}
                                    className={cn(
                                        "w-full justify-start text-left font-normal bg-gray-50/50 border-gray-200 rounded-xl truncate px-3",
                                        !dateRange && "text-muted-foreground"
                                    )}
                                >
                                    <CalendarIcon className="mr-2 h-4 w-4 shrink-0" />
                                    <span className="truncate">
                                        {dateRange?.from ? (
                                            dateRange.to ? (
                                                <>
                                                    {format(dateRange.from, "LLL dd, y")} -{" "}
                                                    {format(dateRange.to, "LLL dd, y")}
                                                </>
                                            ) : (
                                                format(dateRange.from, "LLL dd, y")
                                            )
                                        ) : (
                                            "Pick a date"
                                        )}
                                    </span>
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                                <Calendar
                                    initialFocus
                                    mode="range"
                                    defaultMonth={dateRange?.from}
                                    selected={dateRange}
                                    onSelect={handleDateSelect}
                                    numberOfMonths={2}
                                />
                            </PopoverContent>
                        </Popover>
                        {(searchQuery || statusFilter !== "ALL" || deviceFilter !== "ALL" || dateRange) && (
                            <Button variant="ghost" size="icon" onClick={clearFilters} className="shrink-0 text-red-500 hover:text-red-600 hover:bg-red-50 rounded-xl">
                                <X className="h-4 w-4" />
                            </Button>
                        )}
                    </div>
                </div>
            </header>

            {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                        <Card key={i} className="rounded-[2rem] border-gray-100 h-[380px] p-6 space-y-4">
                            <div className="flex justify-between">
                                <Skeleton className="h-12 w-12 rounded-2xl" />
                                <Skeleton className="h-6 w-24 rounded-full" />
                            </div>
                            <Skeleton className="h-7 w-3/4" />
                            <Skeleton className="h-4 w-full" />
                            <Skeleton className="h-4 w-full" />
                            <div className="grid grid-cols-2 gap-3 pt-4">
                                <Skeleton className="h-12 w-full rounded-2xl" />
                                <Skeleton className="h-12 w-full rounded-2xl" />
                            </div>
                            <div className="pt-6 border-t border-gray-50 flex justify-between">
                                <Skeleton className="h-6 w-24" />
                                <Skeleton className="h-6 w-16" />
                            </div>
                        </Card>
                    ))}
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredTasks.map((task) => (
                        <Card key={task.id} className="rounded-[2rem] border-gray-100 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)] hover:shadow-[0_40px_80px_-20px_rgba(0,0,0,0.1)] transition-all duration-300 group bg-white overflow-hidden flex flex-col">
                            <CardHeader className="p-6 pb-2">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="h-12 w-12 bg-indigo-50 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                                        {getDeviceIcon(task.device)}
                                    </div>
                                    <Badge className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${getStatusColor(task.status)} flex items-center gap-1.5`}>
                                        {getStatusIcon(task.status)}
                                        {task.status}
                                    </Badge>
                                </div>
                                <CardTitle className="text-xl font-bold text-gray-900 group-hover:text-indigo-600 transition-colors line-clamp-1">
                                    {task.title}
                                </CardTitle>
                                <CardDescription className="line-clamp-2 text-gray-500 font-medium mt-1">
                                    {task.description}
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="p-6 pt-4 flex-1 flex flex-col gap-4">
                                <div className="grid grid-cols-2 gap-3">
                                    <div className="bg-gray-50 p-3 rounded-2xl border border-gray-100">
                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Manufacturer</p>
                                        <p className="text-xs font-bold text-gray-700">{task.manufacturer}</p>
                                    </div>
                                    <div className="bg-gray-50 p-3 rounded-2xl border border-gray-100">
                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Serial Number</p>
                                        <p className="text-xs font-bold text-gray-700 font-mono">{task.serialNumber}</p>
                                    </div>
                                </div>

                                <div className="mt-auto pt-4 border-t border-gray-50 flex items-center justify-between text-gray-400">
                                    <div className="flex items-center gap-2">
                                        <div className="h-6 w-6 bg-gray-100 rounded-lg flex items-center justify-center">
                                            <User className="h-3 w-3" />
                                        </div>
                                        <span className="text-[10px] font-black uppercase tracking-widest italic">{task.member?.name || "Unassigned"}</span>
                                    </div>
                                    <div className="flex items-center gap-1.5">
                                        <History className="h-3 w-3" />
                                        <span className="text-[10px] font-bold">
                                            {formatDistanceToNow(new Date(task.createdAt), { addSuffix: true })}
                                        </span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}

            {!isLoading && tasks.length === 0 && (
                <div className="py-24 text-center bg-white rounded-[3rem] border-2 border-dashed border-gray-100 shadow-sm">
                    <div className="h-20 w-20 bg-indigo-50 rounded-3xl flex items-center justify-center mx-auto mb-6">
                        <Laptop className="h-10 w-10 text-indigo-200" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900">No tasks found</h3>
                    <p className="text-gray-500 mt-2 font-medium max-w-xs mx-auto">There are currently no active service requests in the system.</p>
                </div>
            )}
        </div>
    );
}
