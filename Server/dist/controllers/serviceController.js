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
exports.getServiceById = exports.getServices = void 0;
const db_1 = require("../db");
// Get all services
const getServices = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const services = yield db_1.prisma.service.findMany({
            orderBy: {
                createdAt: 'desc',
            },
        });
        res.json(services);
    }
    catch (error) {
        console.error('Failed to fetch services:', error);
        res.status(500).json({ error: 'Failed to fetch services' });
    }
});
exports.getServices = getServices;
// Get service by ID
const getServiceById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const service = yield db_1.prisma.service.findUnique({
            where: { id },
        });
        if (!service) {
            return res.status(404).json({ error: 'Service not found' });
        }
        res.json(service);
    }
    catch (error) {
        console.error('Failed to fetch service:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
exports.getServiceById = getServiceById;
