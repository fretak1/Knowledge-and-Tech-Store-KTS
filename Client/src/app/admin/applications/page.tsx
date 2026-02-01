"use client";

import { useEffect } from "react";
import { useApplicationStore } from "@/store/useApplicationStore";
import { format } from "date-fns";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { Loader2, Phone, Mail, GraduationCap, Users } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export default function AdminApplicationsPage() {
    const {
        isOpen,
        applications,
        isLoading,
        fetch,
        toggle,
        fetchApplications,
    } = useApplicationStore();

    useEffect(() => {
        fetch();
        fetchApplications();
    }, [fetch, fetchApplications]);

    const handleToggle = async (checked: boolean) => {
        const success = await toggle(checked);
        if (success) {
            toast.success(`Application portal ${checked ? 'opened' : 'closed'}`);
        } else {
            toast.error("Failed to update portal status");
        }
    };



    return (
        <div className="container mx-auto py-8 md:py-12 px-4 md:px-6 max-w-7xl space-y-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div className="space-y-2">
                    <h1 className="text-2xl md:text-4xl font-extrabold text-indigo-900 dark:text-white dark:from-white dark:via-indigo-200 dark:to-slate-300 text-center md:text-left">
                        Applications Management
                    </h1>
                    <p className="text-lg text-slate-500 dark:text-slate-400 max-w-2xl">
                        Control the registration process and review incoming member applications efficiently.
                    </p>
                </div>

                <Card className="border-indigo-100 dark:border-indigo-900/50 bg-indigo-50/50 dark:bg-indigo-950/20 shadow-sm min-w-[300px]">
                    <CardContent className="p-6 flex items-center justify-between gap-4">
                        <div className="flex flex-col">
                            <Label htmlFor="app-toggle" className="font-semibold text-base text-slate-900 dark:text-slate-100 mb-1.5 lead-none">
                                Application Portal
                            </Label>
                            <span className={`text-sm font-medium flex items-center gap-2 ${isOpen ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-500'}`}>
                                <span className={`flex h-2.5 w-2.5 rounded-full ${isOpen ? 'bg-emerald-500 animate-pulse' : 'bg-slate-300 dark:bg-slate-700'}`} />
                                {isOpen ? 'Accepting Submissions' : 'Closed for Entry'}
                            </span>
                        </div>
                        <Switch
                            id="app-toggle"
                            checked={isOpen}
                            onCheckedChange={handleToggle}
                            className="data-[state=checked]:bg-emerald-600"
                        />
                    </CardContent>
                </Card>
            </div>

            <Card className="border shadow-xl shadow-slate-200/50 dark:shadow-none dark:bg-slate-900/50 backdrop-blur-md overflow-hidden">
                <CardHeader className="bg-slate-50/50 dark:bg-slate-900/50 border-b border-slate-100 dark:border-slate-800 px-6 py-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle className="text-xl text-slate-800 dark:text-slate-200">
                                Applicants
                                <Badge variant="secondary" className="ml-2 bg-indigo-100 text-indigo-700 dark:bg-indigo-900/50 dark:text-indigo-300">
                                    {applications.length}
                                </Badge>
                            </CardTitle>
                            <CardDescription className="mt-1">
                                Detailed list of all students applying for membership.
                            </CardDescription>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    {isLoading && applications.length === 0 ? (
                        <div className="overflow-x-auto custom-scrollbar">
                            <Table className="min-w-[1000px]">
                                <TableHeader className="bg-slate-50 dark:bg-slate-900/50">
                                    <TableRow>
                                        <TableHead className="w-[250px] pl-6 py-4">Applicant</TableHead>
                                        <TableHead className="w-[200px]">Contact</TableHead>
                                        <TableHead>Academic Info</TableHead>
                                        <TableHead className="max-w-[300px]">Motivation</TableHead>
                                        <TableHead>Applied On</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {[1, 2, 3, 4, 5].map((i) => (
                                        <TableRow key={i}>
                                            <TableCell className="pl-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <Skeleton className="h-10 w-10 rounded-full" />
                                                    <Skeleton className="h-4 w-24" />
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="space-y-2">
                                                    <Skeleton className="h-3 w-32" />
                                                    <Skeleton className="h-3 w-28" />
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="space-y-2">
                                                    <Skeleton className="h-4 w-20" />
                                                    <Skeleton className="h-3 w-16" />
                                                </div>
                                            </TableCell>
                                            <TableCell><Skeleton className="h-4 w-48" /></TableCell>
                                            <TableCell><Skeleton className="h-3 w-20" /></TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    ) : applications.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-20 text-slate-400">
                            <div className="h-16 w-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-4">
                                <GraduationCap className="h-8 w-8 text-slate-400" />
                            </div>
                            <p className="text-lg font-medium text-slate-600 dark:text-slate-300">No applications received yet.</p>
                            <p className="text-sm">When the portal is open, submissions will appear here.</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto custom-scrollbar">
                            <Table className="min-w-[1000px]">
                                <TableHeader className="bg-slate-50 dark:bg-slate-900/50">
                                    <TableRow>
                                        <TableHead className="w-[250px] pl-6 py-4">Applicant</TableHead>
                                        <TableHead className="w-[200px]">Contact</TableHead>
                                        <TableHead>Academic Info</TableHead>
                                        <TableHead className="max-w-[300px]">Motivation</TableHead>
                                        <TableHead>Applied On</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {applications.map((app) => (
                                        <TableRow key={app.id} className="group hover:bg-indigo-50/30 dark:hover:bg-indigo-950/10 transition-colors">
                                            <TableCell className="font-medium pl-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    {app.user?.profileImage ? (
                                                        <img src={app.user.profileImage} alt="" className="h-10 w-10 rounded-full object-cover ring-2 ring-white dark:ring-slate-800 shadow-sm" />
                                                    ) : (
                                                        <div className="h-10 w-10 rounded-full bg-indigo-100 dark:bg-indigo-900 text-indigo-600 dark:text-indigo-300 flex items-center justify-center text-sm font-bold ring-2 ring-white dark:ring-slate-800 shadow-sm">
                                                            {app.name.charAt(0)}
                                                        </div>
                                                    )}
                                                    <div className="flex flex-col">
                                                        <span className="text-slate-900 dark:text-slate-100 font-semibold group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">{app.name}</span>
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex flex-col text-xs gap-1.5">
                                                    <a href={`mailto:${app.email}`} className="flex items-center gap-1.5 text-slate-600 dark:text-slate-400 hover:text-indigo-500 transition-colors">
                                                        <Mail className="h-3.5 w-3.5" />
                                                        {app.email}
                                                    </a>
                                                    <span className="flex items-center gap-1.5 text-slate-500">
                                                        <Phone className="h-3.5 w-3.5" />
                                                        {app.phone}
                                                    </span>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex flex-col gap-1">
                                                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{app.department}</span>
                                                    <Badge variant="outline" className="w-fit text-[10px] h-5 border-slate-200 dark:border-slate-700 text-slate-500">
                                                        Batch {app.batch}
                                                    </Badge>
                                                </div>
                                            </TableCell>
                                            <TableCell className="max-w-[300px]">
                                                <Dialog>
                                                    <DialogTrigger asChild>
                                                        <div className="cursor-pointer group/reason hover:bg-slate-100 dark:hover:bg-slate-800 p-2 rounded-md transition-colors">
                                                            <p className="line-clamp-2 text-sm text-slate-600 dark:text-slate-400 leading-relaxed group-hover/reason:text-slate-900 dark:group-hover/reason:text-slate-200">
                                                                {app.reason}
                                                            </p>
                                                            {app.reason.length > 100 && (
                                                                <span className="text-[10px] text-indigo-500 font-medium opacity-0 group-hover/reason:opacity-100 transition-opacity">
                                                                    Click to read more
                                                                </span>
                                                            )}
                                                        </div>
                                                    </DialogTrigger>
                                                    <DialogContent className="max-w-3xl max-h-[90vh] p-0 overflow-hidden border-none bg-white dark:bg-slate-950 shadow-2xl flex flex-col">
                                                        <DialogHeader className="p-8 pb-4 bg-gradient-to-br from-indigo-50 to-white dark:from-indigo-950/20 dark:to-slate-950 border-b border-indigo-100 dark:border-indigo-900/30 flex-shrink-0">
                                                            <div className="flex items-center gap-4 mb-2">
                                                                <div className="h-12 w-12 rounded-2xl bg-indigo-600 flex items-center justify-center text-white text-xl font-black shadow-lg shadow-indigo-500/20">
                                                                    {app.name.charAt(0)}
                                                                </div>
                                                                <div>
                                                                    <DialogTitle className="text-2xl font-black text-slate-900 dark:text-white">
                                                                        Application Details
                                                                    </DialogTitle>
                                                                    <DialogDescription className="text-indigo-500 font-bold uppercase tracking-wider text-[10px]">
                                                                        Submitted on {format(new Date(app.createdAt), 'MMMM d, yyyy')}
                                                                    </DialogDescription>
                                                                </div>
                                                            </div>
                                                        </DialogHeader>

                                                        <div className="p-8 space-y-8 overflow-y-auto scrollbar-thin scrollbar-thumb-indigo-100 dark:scrollbar-thumb-slate-800 flex-grow">
                                                            {/* Info Grid */}
                                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                                <div className="p-6 rounded-[2rem] bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800 flex flex-col gap-4">
                                                                    <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-black text-xs uppercase tracking-widest">
                                                                        <Users className="h-4 w-4" />
                                                                        Personal Information
                                                                    </div>
                                                                    <div>
                                                                        <p className="font-bold text-slate-900 dark:text-white text-lg">{app.name}</p>
                                                                        <div className="mt-2 space-y-1">
                                                                            <a href={`mailto:${app.email}`} className="flex items-center gap-2 text-sm text-slate-500 hover:text-indigo-600 transition-colors">
                                                                                <Mail className="h-3.5 w-3.5" />
                                                                                {app.email}
                                                                            </a>
                                                                            <p className="flex items-center gap-2 text-sm text-slate-500">
                                                                                <Phone className="h-3.5 w-3.5" />
                                                                                {app.phone}
                                                                            </p>
                                                                        </div>
                                                                    </div>
                                                                </div>

                                                                <div className="p-6 rounded-[2rem] bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800 flex flex-col gap-4">
                                                                    <div className="flex items-center gap-2 text-purple-600 dark:text-purple-400 font-black text-xs uppercase tracking-widest">
                                                                        <GraduationCap className="h-4 w-4" />
                                                                        Academic Status
                                                                    </div>
                                                                    <div>
                                                                        <p className="font-bold text-slate-900 dark:text-white text-lg">{app.department}</p>
                                                                        <Badge variant="secondary" className="mt-2 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 font-bold px-3">
                                                                            Batch of {app.batch}
                                                                        </Badge>
                                                                    </div>
                                                                </div>
                                                            </div>

                                                            {/* Motivation Area */}
                                                            <div className="space-y-4">
                                                                <div className="flex items-center gap-2 text-slate-400 font-black text-xs uppercase tracking-widest">
                                                                    <div className="h-1 w-8 bg-indigo-500 rounded-full" />
                                                                    Motivation Statement
                                                                </div>
                                                                <div className="relative group/text">
                                                                    <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-[2.5rem] blur opacity-10 group-hover/text:opacity-20 transition duration-500"></div>
                                                                    <div className="relative p-8 bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm">
                                                                        <p className="text-slate-600 dark:text-slate-300 text-lg leading-relaxed whitespace-pre-wrap font-medium">
                                                                            {app.reason}
                                                                        </p>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </DialogContent>
                                                </Dialog>
                                            </TableCell>
                                            <TableCell>
                                                <span className="text-xs font-medium text-slate-500">
                                                    {format(new Date(app.createdAt), 'MMM d, yyyy')}
                                                </span>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
