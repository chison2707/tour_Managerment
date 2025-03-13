"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const system_1 = require("../../config/system");
const authMiddleware = __importStar(require("../../middlewares/admin/auth.middleware"));
const dashboard_route_1 = require("./dashboard.route");
const category_route_1 = require("./category.route");
const tour_route_1 = require("./tour.route");
const order_route_1 = require("./order.route");
const upload_route_1 = require("./upload.route");
const acccount_route_1 = require("./acccount.route");
const role_route_1 = require("./role.route");
const auth_route_1 = require("./auth.route");
const user_route_1 = require("./user.route");
const voucher_route_1 = require("./voucher.route");
const authController = __importStar(require("../../controllers/admin/auth.controller"));
const adminRoutes = (app) => {
    const PATH_ADMIN = `/${system_1.systemConfig.prefixAdmin}`;
    app.get(PATH_ADMIN, authController.login);
    app.use(`${PATH_ADMIN}/auth`, auth_route_1.authRoutes);
    app.use(`${PATH_ADMIN}/dashboard`, authMiddleware.requireAuth, dashboard_route_1.dashboardRoutes);
    app.use(`${PATH_ADMIN}/categories`, authMiddleware.requireAuth, category_route_1.categoryRoutes);
    app.use(`${PATH_ADMIN}/tours`, authMiddleware.requireAuth, tour_route_1.tourRoutes);
    app.use(`${PATH_ADMIN}/upload`, authMiddleware.requireAuth, upload_route_1.uploadRoutes);
    app.use(`${PATH_ADMIN}/orders`, authMiddleware.requireAuth, order_route_1.orderRoutes);
    app.use(`${PATH_ADMIN}/accounts`, authMiddleware.requireAuth, acccount_route_1.accountRoutes);
    app.use(`${PATH_ADMIN}/roles`, authMiddleware.requireAuth, role_route_1.roleRoutes);
    app.use(`${PATH_ADMIN}/users`, authMiddleware.requireAuth, user_route_1.userRoutes);
    app.use(`${PATH_ADMIN}/vouchers`, authMiddleware.requireAuth, voucher_route_1.voucherRoutes);
};
exports.default = adminRoutes;
