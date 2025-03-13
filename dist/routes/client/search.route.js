"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.searchRoutes = void 0;
const express_1 = require("express");
const router = (0, express_1.Router)();
const controller = require("../../controllers/client/search.controller");
router.get('/', controller.index);
exports.searchRoutes = router;
