"use client";

import { useEffect, useMemo } from "react";
import { useTaskStore } from "@/store/useTaskStore";
import { useUserStore } from "@/store/useUserStore";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
    ResponsiveContainer,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    PieChart,
    Pie,
    Cell,
    LineChart,
    Line
} from "recharts";
import {
    LayoutDashboard,
    CheckCircle2,
    Clock,
    Laptop,
    Users,
    UserCheck,
    TrendingUp
} from "lucide-react";

const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

export default function AnalysisPage() {
    const { tasks, getTasks, isLoading: tasksLoading } = useTaskStore();
    const { members, getMembers, students, getStudents, isLoading: usersLoading } = useUserStore();

    useEffect(() => {
        getTasks();
        getMembers();
        getStudents();
    }, [getTasks, getMembers, getStudents]);

    const stats = useMemo(() => {
        const totalTasks = tasks.length;
        const completedTasks = tasks.filter(t => t.status === 'COMPLETED').length;
        const inProgressTasks = tasks.filter(t => t.status === 'IN_PROGRESS').length;
        const pendingTasks = tasks.filter(t => t.status === 'PENDING').length;

        const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

        // Task Status Distribution
        const statusData = [
            { name: 'Completed', value: completedTasks },
            { name: 'In Progress', value: inProgressTasks },
            { name: 'Pending', value: pendingTasks },
        ].filter(d => d.value > 0);

        // Device Distribution
        const deviceMap: Record<string, number> = {};
        tasks.forEach(t => {
            const device = t.device || 'Unknown';
            deviceMap[device] = (deviceMap[device] || 0) + 1;
        });
        const deviceData = Object.entries(deviceMap).map(([name, value]) => ({ name, value }));

        // Student Department Distribution
        const studentDeptMap: Record<string, number> = {};
        students.forEach(s => {
            const dept = s.department || 'Unspecified';
            studentDeptMap[dept] = (studentDeptMap[dept] || 0) + 1;
        });
        const studentDeptData = Object.entries(studentDeptMap).map(([name, value]) => ({ name, value }));

        // Student Batch Distribution
        const studentBatchMap: Record<string, number> = {};
        students.forEach(s => {
            const batch = s.batch || 'Unspecified';
            studentBatchMap[batch] = (studentBatchMap[batch] || 0) + 1;
        });
        const studentBatchData = Object.entries(studentBatchMap)
            .map(([name, value]) => ({ name, value }))
            .sort((a, b) => a.name.localeCompare(b.name));

        // Member Department Distribution
        const memberDeptMap: Record<string, number> = {};
        members.forEach(m => {
            const dept = m.department || 'Unspecified';
            memberDeptMap[dept] = (memberDeptMap[dept] || 0) + 1;
        });
        const memberDeptData = Object.entries(memberDeptMap).map(([name, value]) => ({ name, value }));

        // Member Batch Distribution
        const memberBatchMap: Record<string, number> = {};
        members.forEach(m => {
            const batch = m.batch || 'Unspecified';
            memberBatchMap[batch] = (memberBatchMap[batch] || 0) + 1;
        });
        const memberBatchData = Object.entries(memberBatchMap)
            .map(([name, value]) => ({ name, value }))
            .sort((a, b) => a.name.localeCompare(b.name));

        // Trend Analysis (Last 7 days of tasks)
        const trendMap: Record<string, number> = {};
        tasks.forEach(t => {
            const date = new Date(t.createdAt).toLocaleDateString();
            trendMap[date] = (trendMap[date] || 0) + 1;
        });
        const trendData = Object.entries(trendMap)
            .map(([date, count]) => ({ date, count }))
            .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
            .slice(-7);

        return {
            totalTasks,
            completedTasks,
            completionRate,
            totalStudents: students.length,
            totalMembers: members.length,
            statusData,
            deviceData,
            studentDeptData,
            studentBatchData,
            memberDeptData,
            memberBatchData,
            trendData
        };
    }, [tasks, students, members]);

    const isLoading = tasksLoading || usersLoading;

    if (isLoading && tasks.length === 0) {
        return (
            <div className="p-8 space-y-8 animate-pulse">
                <div className="h-10 w-48 bg-gray-200 rounded-lg mb-8" />
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {[1, 2, 3, 4].map(i => <div key={i} className="h-32 bg-gray-100 rounded-3xl" />)}
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="h-80 bg-gray-100 rounded-3xl" />
                    <div className="h-80 bg-gray-100 rounded-3xl" />
                </div>
            </div>
        );
    }

    return (
        <div className="p-6 md:p-8 space-y-8 bg-gray-50/50 min-h-screen">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-200 pb-8">
                <div>
                    <h1 className="text-3xl font-black text-gray-900 tracking-tight flex items-center gap-3">
                        <LayoutDashboard className="h-8 w-8 text-indigo-600" />
                        System Analysis
                    </h1>
                    <p className="text-gray-500 font-medium">Real-time insights and performance metrics across the platform.</p>
                </div>
            </header>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card className="rounded-[2.5rem] border-gray-100 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)] hover:scale-[1.02] transition-transform bg-white overflow-hidden">
                    <CardContent className="p-8 flex items-center gap-6">
                        <div className="h-16 w-16 bg-indigo-50 rounded-2xl flex items-center justify-center">
                            <Laptop className="h-8 w-8 text-indigo-600" />
                        </div>
                        <div>
                            <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">Total Tasks</p>
                            <h3 className="text-3xl font-black text-gray-900">{stats.totalTasks}</h3>
                        </div>
                    </CardContent>
                </Card>

                <Card className="rounded-[2.5rem] border-gray-100 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)] hover:scale-[1.02] transition-transform bg-white overflow-hidden">
                    <CardContent className="p-8 flex items-center gap-6">
                        <div className="h-16 w-16 bg-green-50 rounded-2xl flex items-center justify-center">
                            <CheckCircle2 className="h-8 w-8 text-green-600" />
                        </div>
                        <div>
                            <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">Completion Rate</p>
                            <h3 className="text-3xl font-black text-gray-900">{stats.completionRate}%</h3>
                        </div>
                    </CardContent>
                </Card>

                <Card className="rounded-[2.5rem] border-gray-100 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)] hover:scale-[1.02] transition-transform bg-white overflow-hidden">
                    <CardContent className="p-8 flex items-center gap-6">
                        <div className="h-16 w-16 bg-blue-50 rounded-2xl flex items-center justify-center">
                            <Users className="h-8 w-8 text-blue-600" />
                        </div>
                        <div>
                            <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">Total Students</p>
                            <h3 className="text-3xl font-black text-gray-900">{stats.totalStudents}</h3>
                        </div>
                    </CardContent>
                </Card>

                <Card className="rounded-[2.5rem] border-gray-100 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)] hover:scale-[1.02] transition-transform bg-white overflow-hidden">
                    <CardContent className="p-8 flex items-center gap-6">
                        <div className="h-16 w-16 bg-purple-50 rounded-2xl flex items-center justify-center">
                            <UserCheck className="h-8 w-8 text-purple-600" />
                        </div>
                        <div>
                            <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">Total Members</p>
                            <h3 className="text-3xl font-black text-gray-900">{stats.totalMembers}</h3>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Task Status Distribution */}
                <Card className="rounded-[3rem] border-gray-100 shadow-xl bg-white overflow-hidden">
                    <CardHeader className="p-8 pb-0">
                        <CardTitle className="text-xl font-black flex items-center gap-2">
                            <Clock className="h-5 w-5 text-indigo-600" />
                            Task Status Distribution
                        </CardTitle>
                        <CardDescription className="text-gray-500 font-medium">Breakdown of service requests by their current lifecycle stage.</CardDescription>
                    </CardHeader>
                    <CardContent className="p-8 h-[350px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={stats.statusData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={70}
                                    outerRadius={100}
                                    paddingAngle={5}
                                    dataKey="value"
                                    label={({ percent }) => `${((percent || 0) * 100).toFixed(0)}%`}
                                    labelLine={false}
                                >
                                    {stats.statusData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip
                                    contentStyle={{ borderRadius: '1rem', border: 'none', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)' }}
                                />
                                <Legend verticalAlign="bottom" height={36} />
                            </PieChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                {/* Device Distribution */}
                <Card className="rounded-[3rem] border-gray-100 shadow-xl bg-white overflow-hidden">
                    <CardHeader className="p-8 pb-0">
                        <CardTitle className="text-xl font-black flex items-center gap-2">
                            <Laptop className="h-5 w-5 text-indigo-600" />
                            Device Distribution
                        </CardTitle>
                        <CardDescription className="text-gray-500 font-medium">Most common device types requiring technical assistance.</CardDescription>
                    </CardHeader>
                    <CardContent className="p-8 h-[350px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={stats.deviceData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} className="text-xs font-bold text-gray-400" />
                                <YAxis axisLine={false} tickLine={false} className="text-xs font-bold text-gray-400" />
                                <Tooltip
                                    cursor={{ fill: '#f8fafc' }}
                                    contentStyle={{ borderRadius: '1rem', border: 'none', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)' }}
                                />
                                <Bar dataKey="value" fill="#6366f1" radius={[8, 8, 0, 0]} barSize={40} />
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                {/* Student Department Distribution */}
                <Card className="rounded-[3rem] border-gray-100 shadow-xl bg-white overflow-hidden">
                    <CardHeader className="p-8 pb-0">
                        <CardTitle className="text-xl font-black flex items-center gap-2">
                            <Users className="h-5 w-5 text-indigo-600" />
                            Student Distribution by Department
                        </CardTitle>
                        <CardDescription className="text-gray-500 font-medium">Breakdown of students across various academic departments.</CardDescription>
                    </CardHeader>
                    <CardContent className="p-8 h-[350px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={stats.studentDeptData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={70}
                                    outerRadius={100}
                                    paddingAngle={5}
                                    dataKey="value"
                                    label={({ percent }) => `${((percent || 0) * 100).toFixed(0)}%`}
                                    labelLine={false}
                                >
                                    {stats.studentDeptData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[(index + 2) % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip
                                    contentStyle={{ borderRadius: '1rem', border: 'none', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)' }}
                                />
                                <Legend verticalAlign="bottom" height={36} />
                            </PieChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                {/* Member Department Distribution */}
                <Card className="rounded-[3rem] border-gray-100 shadow-xl bg-white overflow-hidden">
                    <CardHeader className="p-8 pb-0">
                        <CardTitle className="text-xl font-black flex items-center gap-2">
                            <UserCheck className="h-5 w-5 text-indigo-600" />
                            Member Distribution by Department
                        </CardTitle>
                        <CardDescription className="text-gray-500 font-medium">Expertise and resource allocation of technicians by department.</CardDescription>
                    </CardHeader>
                    <CardContent className="p-8 h-[350px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart layout="vertical" data={stats.memberDeptData}>
                                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                                <XAxis type="number" axisLine={false} tickLine={false} className="text-xs font-bold text-gray-400" />
                                <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} className="text-xs font-bold text-gray-400" width={100} />
                                <Tooltip
                                    cursor={{ fill: '#f8fafc' }}
                                    contentStyle={{ borderRadius: '1rem', border: 'none', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)' }}
                                />
                                <Bar dataKey="value" fill="#10b981" radius={[0, 8, 8, 0]} barSize={20} />
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                {/* Member Batch Distribution */}
                <Card className="rounded-[3rem] border-gray-100 shadow-xl bg-white overflow-hidden lg:col-span-2">
                    <CardHeader className="p-8 pb-0">
                        <CardTitle className="text-xl font-black flex items-center gap-2">
                            <LayoutDashboard className="h-5 w-5 text-indigo-600" />
                            Member Distribution by Batch
                        </CardTitle>
                        <CardDescription className="text-gray-500 font-medium">Numerical distribution of technical members by their academic year/batch.</CardDescription>
                    </CardHeader>
                    <CardContent className="p-8 h-[350px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={stats.memberBatchData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} className="text-xs font-bold text-gray-400" />
                                <YAxis axisLine={false} tickLine={false} className="text-xs font-bold text-gray-400" />
                                <Tooltip
                                    cursor={{ fill: '#f8fafc' }}
                                    contentStyle={{ borderRadius: '1rem', border: 'none', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)' }}
                                />
                                <Bar dataKey="value" fill="#10b981" radius={[8, 8, 0, 0]} barSize={60} />
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                {/* Student Batch Distribution */}
                <Card className="rounded-[3rem] border-gray-100 shadow-xl bg-white overflow-hidden lg:col-span-2">
                    <CardHeader className="p-8 pb-0">
                        <CardTitle className="text-xl font-black flex items-center gap-2">
                            <LayoutDashboard className="h-5 w-5 text-indigo-600" />
                            Student Distribution by Batch
                        </CardTitle>
                        <CardDescription className="text-gray-500 font-medium">Numerical distribution of students by their academic year/batch.</CardDescription>
                    </CardHeader>
                    <CardContent className="p-8 h-[350px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={stats.studentBatchData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} className="text-xs font-bold text-gray-400" />
                                <YAxis axisLine={false} tickLine={false} className="text-xs font-bold text-gray-400" />
                                <Tooltip
                                    cursor={{ fill: '#f8fafc' }}
                                    contentStyle={{ borderRadius: '1rem', border: 'none', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)' }}
                                />
                                <Bar dataKey="value" fill="#f59e0b" radius={[8, 8, 0, 0]} barSize={60} />
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                {/* Task Creation Trends */}
                <Card className="rounded-[3rem] border-gray-100 shadow-xl bg-white overflow-hidden lg:col-span-2">
                    <CardHeader className="p-8 pb-0">
                        <CardTitle className="text-xl font-black flex items-center gap-2">
                            <TrendingUp className="h-5 w-5 text-indigo-600" />
                            Task Creation Trends
                        </CardTitle>
                        <CardDescription className="text-gray-500 font-medium">Daily volume of new service requests over the past 7 active days.</CardDescription>
                    </CardHeader>
                    <CardContent className="p-8 h-[350px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={stats.trendData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis dataKey="date" axisLine={false} tickLine={false} className="text-xs font-bold text-gray-400" />
                                <YAxis axisLine={false} tickLine={false} className="text-xs font-bold text-gray-400" />
                                <Tooltip
                                    contentStyle={{ borderRadius: '1rem', border: 'none', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)' }}
                                />
                                <Line
                                    type="monotone"
                                    dataKey="count"
                                    stroke="#6366f1"
                                    strokeWidth={4}
                                    dot={{ r: 6, fill: '#6366f1', strokeWidth: 0 }}
                                    activeDot={{ r: 8, strokeWidth: 0 }}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}