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
exports.deleteRecurringShift = exports.deleteShift = exports.updateShift = exports.getRecurringShifts = exports.getShifts = exports.createRecurringShift = exports.createShift = void 0;
const db_1 = require("../db");
const date_fns_1 = require("date-fns");
const createShift = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { date, startTime, endTime, userId } = req.body;
        // Manual Validation
        if (!date || !startTime || !endTime) {
            return res.status(400).json({ error: "Missing required fields" });
        }
        const shift = yield db_1.prisma.shift.create({
            data: {
                date: new Date(date),
                startTime,
                endTime,
                userId,
            },
            include: { user: true }
        });
        res.status(201).json(shift);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to create shift' });
    }
});
exports.createShift = createShift;
const createRecurringShift = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { dayOfWeek, startTime, endTime, userId } = req.body;
        // Manual Validation
        if (dayOfWeek === undefined || dayOfWeek < 0 || dayOfWeek > 6 || !startTime || !endTime || !userId) {
            return res.status(400).json({ error: "Invalid or missing fields" });
        }
        const shift = yield db_1.prisma.recurringShift.create({
            data: {
                dayOfWeek,
                startTime,
                endTime,
                userId,
            },
            include: { user: true }
        });
        res.status(201).json(shift);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to create recurring shift' });
    }
});
exports.createRecurringShift = createRecurringShift;
const getShifts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { start, end } = req.query;
        // 1. Fetch Real Shifts
        let whereConfig = {};
        if (start && end) {
            whereConfig = {
                date: {
                    gte: new Date(String(start)),
                    lte: new Date(String(end)),
                }
            };
        }
        const realShifts = yield db_1.prisma.shift.findMany({
            where: whereConfig,
            include: {
                user: {
                    select: { id: true, name: true, email: true, profileImage: true }
                }
            },
            orderBy: {
                date: 'asc',
            }
        });
        // 2. Fetch Recurring Shifts
        const recurringShifts = yield db_1.prisma.recurringShift.findMany({
            include: {
                user: {
                    select: { id: true, name: true, email: true, profileImage: true }
                }
            }
        });
        // 3. Synthesize Recurring Shifts into the range
        const syntheticShifts = [];
        if (start && end) {
            const startDate = (0, date_fns_1.parseISO)(String(start));
            const endDate = (0, date_fns_1.parseISO)(String(end));
            const dayCount = (0, date_fns_1.differenceInDays)(endDate, startDate) + 1;
            for (let i = 0; i < dayCount; i++) {
                const currentDate = (0, date_fns_1.addDays)(startDate, i);
                const currentDayOfWeek = currentDate.getDay(); // 0-6
                // Find recurring shifts for this day of week
                const dayRecurrings = recurringShifts.filter(r => r.dayOfWeek === currentDayOfWeek);
                for (let r of dayRecurrings) {
                    // Check if this recurring shift is "overridden" by a real shift
                    // We check if there's a real shift for this user on this day with the SAME start time.
                    const isOverridden = realShifts.some(real => (0, date_fns_1.isSameDay)(new Date(real.date), currentDate) &&
                        real.userId === r.userId &&
                        real.startTime === r.startTime);
                    if (isOverridden) {
                        continue;
                    }
                    syntheticShifts.push({
                        id: `recurring_${r.id}_${(0, date_fns_1.format)(currentDate, 'yyyy-MM-dd')}`,
                        originalRecurringId: r.id,
                        date: currentDate.toISOString(), // Use exact date instance
                        startTime: r.startTime,
                        endTime: r.endTime,
                        userId: r.userId,
                        user: r.user,
                        status: 'ASSIGNED', // Default status for recurring
                        isRecurring: true
                    });
                }
            }
        }
        // Combine and sort
        const allShifts = [...realShifts, ...syntheticShifts].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
        res.json(allShifts);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch shifts' });
    }
});
exports.getShifts = getShifts;
const getRecurringShifts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const shifts = yield db_1.prisma.recurringShift.findMany({
            include: {
                user: {
                    select: { id: true, name: true, email: true, profileImage: true }
                }
            },
            orderBy: [
                { dayOfWeek: 'asc' },
                { startTime: 'asc' }
            ]
        });
        res.json(shifts);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch recurring shifts' });
    }
});
exports.getRecurringShifts = getRecurringShifts;
const updateShift = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const { startTime, endTime, userId, status } = req.body;
        // Check if we are updating a recurring (virtual) shift
        if (id.startsWith('recurring_')) {
            // ID Format: recurring_{id}_{yyyy-MM-dd}
            const parts = id.split('_');
            if (parts.length >= 3) {
                const recurringId = parts[1];
                const dateStr = parts.slice(2).join('_'); // Just in case, though yyyy-MM-dd shouldn't split
                const recurringShift = yield db_1.prisma.recurringShift.findUnique({
                    where: { id: recurringId }
                });
                if (!recurringShift) {
                    return res.status(404).json({ error: 'Recurring shift template not found' });
                }
                // Materialize it into a REAL shift
                const newShift = yield db_1.prisma.shift.create({
                    data: {
                        date: new Date(dateStr),
                        startTime: startTime || recurringShift.startTime,
                        endTime: endTime || recurringShift.endTime,
                        userId: userId || recurringShift.userId,
                        status: status || 'ASSIGNED'
                    },
                    include: { user: true }
                });
                return res.json(newShift);
            }
        }
        const shift = yield db_1.prisma.shift.update({
            where: { id },
            data: {
                startTime,
                endTime,
                userId, // Update or Assign/Unassign
                status,
            },
            include: { user: true }
        });
        res.json(shift);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to update shift' });
    }
});
exports.updateShift = updateShift;
const deleteShift = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        if (id.startsWith('recurring_')) {
            // It's a virtual shift. Deleting a single instance of a recurring shift 
            // usually implies creating an exception. For now, we don't support deleting instances directly
            // without creating a blocking record (which we haven't implemented).
            // But we SHOULD allow "skipping" it if we had that logic.
            // For now, let's just return success but do nothing? No, that's confusing.
            return res.status(400).json({ error: "Cannot delete a routine shift directly. You can mark it as Absent." });
        }
        yield db_1.prisma.shift.delete({ where: { id } });
        res.json({ message: 'Shift deleted' });
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to delete shift' });
    }
});
exports.deleteShift = deleteShift;
const deleteRecurringShift = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        yield db_1.prisma.recurringShift.delete({ where: { id } });
        res.json({ message: 'Recurring shift template deleted' });
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to delete recurring shift' });
    }
});
exports.deleteRecurringShift = deleteRecurringShift;
