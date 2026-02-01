import { Request, Response } from 'express';
import { prisma } from '../db';
import { addDays, differenceInDays, format, isSameDay, parseISO, startOfDay } from 'date-fns';

export const createShift = async (req: Request, res: Response) => {
    try {
        const { date, startTime, endTime, userId } = req.body;

        // Manual Validation
        if (!date || !startTime || !endTime) {
            return res.status(400).json({ error: "Missing required fields" });
        }

        const shift = await prisma.shift.create({
            data: {
                date: new Date(date),
                startTime,
                endTime,
                userId,
            },
            include: { user: true }
        });

        res.status(201).json(shift);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to create shift' });
    }
};

export const createRecurringShift = async (req: Request, res: Response) => {
    try {
        const { dayOfWeek, startTime, endTime, userId } = req.body;

        // Manual Validation
        if (dayOfWeek === undefined || dayOfWeek < 0 || dayOfWeek > 6 || !startTime || !endTime || !userId) {
            return res.status(400).json({ error: "Invalid or missing fields" });
        }

        const shift = await prisma.recurringShift.create({
            data: {
                dayOfWeek,
                startTime,
                endTime,
                userId,
            },
            include: { user: true }
        });

        res.status(201).json(shift);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to create recurring shift' });
    }
}


export const getShifts = async (req: Request, res: Response) => {
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

        const realShifts = await prisma.shift.findMany({
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
        const recurringShifts = await prisma.recurringShift.findMany({
            include: {
                user: {
                    select: { id: true, name: true, email: true, profileImage: true }
                }
            }
        });

        // 3. Synthesize Recurring Shifts into the range
        const syntheticShifts: any[] = [];
        if (start && end) {
            const startDate = parseISO(String(start));
            const endDate = parseISO(String(end));
            const dayCount = differenceInDays(endDate, startDate) + 1;

            for (let i = 0; i < dayCount; i++) {
                const currentDate = addDays(startDate, i);
                const currentDayOfWeek = currentDate.getDay(); // 0-6

                // Find recurring shifts for this day of week
                const dayRecurrings = recurringShifts.filter(r => r.dayOfWeek === currentDayOfWeek);

                for (let r of dayRecurrings) {
                    // Check if this recurring shift is "overridden" by a real shift
                    // We check if there's a real shift for this user on this day with the SAME start time.
                    const isOverridden = realShifts.some(real =>
                        isSameDay(new Date(real.date), currentDate) &&
                        real.userId === r.userId &&
                        real.startTime === r.startTime
                    );

                    if (isOverridden) {
                        continue;
                    }

                    syntheticShifts.push({
                        id: `recurring_${r.id}_${format(currentDate, 'yyyy-MM-dd')}`,
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
        const allShifts = [...realShifts, ...syntheticShifts].sort((a, b) =>
            new Date(a.date).getTime() - new Date(b.date).getTime()
        );

        res.json(allShifts);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch shifts' });
    }
};

export const getRecurringShifts = async (req: Request, res: Response) => {
    try {
        const shifts = await prisma.recurringShift.findMany({
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
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch recurring shifts' });
    }
};

export const updateShift = async (req: Request, res: Response) => {
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

                const recurringShift = await prisma.recurringShift.findUnique({
                    where: { id: recurringId }
                });

                if (!recurringShift) {
                    return res.status(404).json({ error: 'Recurring shift template not found' });
                }

                // Materialize it into a REAL shift
                const newShift = await prisma.shift.create({
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

        const shift = await prisma.shift.update({
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
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to update shift' });
    }
};

export const deleteShift = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        if (id.startsWith('recurring_')) {
            return res.status(400).json({ error: "Cannot delete a routine shift directly. You can mark it as Absent." });
        }

        await prisma.shift.delete({ where: { id } });
        res.json({ message: 'Shift deleted' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete shift' });
    }
};

export const deleteRecurringShift = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        await prisma.recurringShift.delete({ where: { id } });
        res.json({ message: 'Recurring shift template deleted' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete recurring shift' });
    }
}
