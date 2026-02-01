"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAdminStats = void 0;
const db_1 = require("../db");
const getAdminStats = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // 1. Basic counts
        const [userCount, taskCount, eventCount, blogCount] = yield Promise.all([
            db_1.prisma.user.count(),
            db_1.prisma.task.count(),
            db_1.prisma.event.count(),
            db_1.prisma.blog.count(),
        ]);
        // 2. User role distribution
        const userRoles = yield db_1.prisma.user.groupBy({
            by: ['role'],
            _count: true,
        });
        // 3. Task status distribution
        const taskStatus = yield db_1.prisma.task.groupBy({
            by: ['status'],
            _count: true,
        });
        // 4. Device distribution
        const deviceDistribution = yield db_1.prisma.task.groupBy({
            by: ['device'],
            _count: true,
        });
        // 5. Manufacturer distribution
        const manufacturerDistribution = yield db_1.prisma.task.groupBy({
            by: ['manufacturer'],
            _count: true,
            orderBy: {
                _count: {
                    manufacturer: 'desc'
                }
            },
            take: 5
        });
        // 6. Tasks over time (Last 7 days)
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        const tasksOverTimeRaw = yield db_1.prisma.task.findMany({
            where: {
                createdAt: {
                    gte: sevenDaysAgo
                }
            },
            select: {
                createdAt: true
            }
        });
        // Group by day for the chart
        const dailyTasks = {};
        for (let i = 0; i < 7; i++) {
            const date = new Date();
            date.setDate(date.getDate() - i);
            dailyTasks[date.toISOString().split('T')[0]] = 0;
        }
        tasksOverTimeRaw.forEach(task => {
            const day = task.createdAt.toISOString().split('T')[0];
            if (dailyTasks[day] !== undefined) {
                dailyTasks[day]++;
            }
        });
        const taskTrend = Object.entries(dailyTasks)
            .map(([date, count]) => ({ date, count }))
            .sort((a, b) => a.date.localeCompare(b.date));
        res.json({
            overview: {
                users: userCount,
                tasks: taskCount,
                events: eventCount,
                blogs: blogCount,
            },
            distributions: {
                roles: userRoles.map(r => ({ name: r.role, value: r._count })),
                status: taskStatus.map(s => ({ name: s.status, value: s._count })),
                devices: deviceDistribution.map(d => ({ name: d.device, value: d._count })),
                manufacturers: manufacturerDistribution.map(m => ({ name: m.manufacturer, value: m._count })),
            },
            trends: {
                tasks: taskTrend
            }
        });
    }
    catch (error) {
        console.error("Analysis stats error:", error);
        res.status(500).json({ error: "Failed to fetch analysis stats" });
    }
});
exports.getAdminStats = getAdminStats;
