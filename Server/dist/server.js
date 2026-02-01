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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const db_1 = require("./db");
// Routes
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const serviceRoutes_1 = __importDefault(require("./routes/serviceRoutes"));
const userRoutes_1 = __importDefault(require("./routes/userRoutes"));
const eventRoutes_1 = __importDefault(require("./routes/eventRoutes"));
const guideRoutes_1 = __importDefault(require("./routes/guideRoutes"));
const tasksRoutes_1 = __importDefault(require("./routes/tasksRoutes"));
const blogRoutes_1 = __importDefault(require("./routes/blogRoutes"));
const analysisRoutes_1 = __importDefault(require("./routes/analysisRoutes"));
const messageRoutes_1 = __importDefault(require("./routes/messageRoutes"));
const notificationRoutes_1 = __importDefault(require("./routes/notificationRoutes"));
const applicationRoutes_1 = __importDefault(require("./routes/applicationRoutes"));
const shiftRoutes_1 = __importDefault(require("./routes/shiftRoutes"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 4000;
// Middleware
app.use((0, cors_1.default)({
    origin: 'http://localhost:3000', // Allow Client
    credentials: true,
}));
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
// Mount Routes
app.use('/api/auth', authRoutes_1.default);
app.use('/api/services', serviceRoutes_1.default);
app.use('/api/users', userRoutes_1.default);
app.use('/api/events', eventRoutes_1.default);
app.use('/api/guides', guideRoutes_1.default);
app.use('/api/tasks', tasksRoutes_1.default);
app.use('/api/user', userRoutes_1.default);
app.use('/api/blogs', blogRoutes_1.default);
app.use('/api/analysis', analysisRoutes_1.default);
app.use('/api/messages', messageRoutes_1.default);
app.use('/api/notifications', notificationRoutes_1.default);
app.use('/api/applications', applicationRoutes_1.default);
app.use('/api/shifts', shiftRoutes_1.default);
// Health check route
app.get('/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});
// Database connection test
app.get('/db-check', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userCount = yield db_1.prisma.user.count();
        res.json({ status: 'connected', userCount });
    }
    catch (error) {
        console.error('Database connection error:', error);
        res.status(500).json({ status: 'error', message: 'Failed to connect to database' });
    }
}));
// Server start
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
