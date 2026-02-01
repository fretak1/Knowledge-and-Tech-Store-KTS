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
exports.updateTaskStatus = exports.getTasks = exports.createTask = void 0;
const db_1 = require("../db");
/**
 * MEMBER → Create a task (service request)
 */
const createTask = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { title, description, device, manufacturer, serialNumber, studentId } = req.body;
        const memberId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId; // from auth middleware
        const task = yield db_1.prisma.task.create({
            data: {
                title,
                description,
                device: device || "PC",
                manufacturer: manufacturer || "Unknown",
                serialNumber: serialNumber || "N/A",
                memberId,
                studentId: studentId, // assigned later or by admin
            },
        });
        res.status(201).json({ data: task, success: true });
    }
    catch (error) {
        console.error("Create task error:", error);
        res.status(500).json({ error: "Failed to create task" });
    }
});
exports.createTask = createTask;
/**
 * MEMBER → Get own tasks
 */
const getTasks = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user; // from auth middleware
    let tasks;
    if ((user === null || user === void 0 ? void 0 : user.role) === 'STUDENT') {
        tasks = yield db_1.prisma.task.findMany({
            where: { studentId: user.userId },
            select: {
                id: true,
                title: true,
                description: true,
                device: true,
                manufacturer: true,
                serialNumber: true,
                status: true,
                createdAt: true,
                member: {
                    select: {
                        name: true,
                    },
                },
            },
        });
    }
    else if ((user === null || user === void 0 ? void 0 : user.role) === 'MEMBER') {
        tasks = yield db_1.prisma.task.findMany({
            where: { memberId: user.userId },
            include: {
                student: {
                    select: { id: true, name: true, department: true, batch: true },
                },
            },
        });
    }
    else if ((user === null || user === void 0 ? void 0 : user.role) === 'ADMIN') {
        tasks = yield db_1.prisma.task.findMany({
            include: {
                student: true,
                member: true,
            },
        });
    }
    res.json(tasks);
});
exports.getTasks = getTasks;
/**
 * STUDENT → Update task status
 */
const updateTaskStatus = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const { status } = req.body;
        const task = yield db_1.prisma.task.update({
            where: { id },
            data: { status },
        });
        if (task.status === "COMPLETED") {
            yield db_1.prisma.notification.create({
                data: {
                    userId: task.studentId,
                    message: `Great news! Your task "${task.title}" has been completed.`,
                },
            });
        }
        res.json({ data: task, success: true });
    }
    catch (error) {
        res.status(500).json({ error: "Failed to update task status" });
    }
});
exports.updateTaskStatus = updateTaskStatus;
/**
 * ADMIN / STUDENT → Assign task to student
 */
// export const assignTaskToStudent = async (req: Request, res: Response) => {
//   try {
//     const { id } = req.params;
//     const { studentId } = req.body;
//     const task = await prisma.task.update({
//       where: { id },
//       data: { studentId },
//     });
//     res.json(task);
//   } catch (error) {
//     res.status(500).json({ error: "Failed to assign task" });
//   }
// };
