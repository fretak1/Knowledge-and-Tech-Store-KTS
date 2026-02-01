"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const serviceController_1 = require("../controllers/serviceController");
const router = (0, express_1.Router)();
router.get('/getServices', serviceController_1.getServices);
router.get('/getService/:id', serviceController_1.getServiceById);
exports.default = router;
