import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import { prisma } from './db';

// Routes
import authRoutes from './routes/authRoutes';
import userRoutes from './routes/userRoutes';
import eventRoutes from './routes/eventRoutes';
import guideRoutes from './routes/guideRoutes';
import taskRoutes from './routes/tasksRoutes';
import blogRoutes from './routes/blogRoutes';
import messageRoutes from './routes/messageRoutes';
import notificationRoutes from './routes/notificationRoutes';
import applicationRoutes from './routes/applicationRoutes';
import shiftRoutes from './routes/shiftRoutes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

// ✅ Allowed Origins
const allowedOrigins = [
  "https://knowledge-and-tech-store-kts.vercel.app",
  "http://localhost:3000"
];

// ✅ CORS Options
const corsOptions = {
  origin: function (origin: any, callback: any) {
    console.log("Incoming request origin:", origin);
    // allow requests with no origin (like Postman, server-to-server)
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error(`Not allowed by CORS: ${origin}`));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
};

// ✅ Use CORS middleware BEFORE anything else
app.use(cors(corsOptions));

// ✅ Preflight requests
app.options("*", cors(corsOptions));

// ✅ Body parsing
app.use(express.json());
app.use(cookieParser());

app.use((req, res, next) => {
  console.log('Incoming request URL:', req.url);
  console.log('Request method:', req.method);
  console.log('Request origin:', req.headers.origin);
  next();
});

// ✅ Mount Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/guides', guideRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/user', userRoutes);
app.use('/api/blogs', blogRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/applications', applicationRoutes);
app.use('/api/shifts', shiftRoutes);

// ✅ Health check route
app.get('/health', (req: Request, res: Response) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// ✅ Database connection test
app.get('/db-check', async (req: Request, res: Response) => {
    try {
        const userCount = await prisma.user.count();
        res.json({ status: 'connected', userCount });
    } catch (error) {
        console.error('Database connection error:', error);
        res.status(500).json({ status: 'error', message: 'Failed to connect to database' });
    }
});

// ✅ Start Server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
