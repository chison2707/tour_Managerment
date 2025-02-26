import { Express } from "express";
import { systemConfig } from "../../config/system";
import * as authMiddleware from "../../middlewares/admin/auth.middleware";

import { categoryRoutes } from "./category.route";
import { tourRoutes } from "./tour.route";
import { orderRoutes } from "./order.route";
import { uploadRoutes } from "./upload.route"
import { accountRoutes } from "./acccount.route"
import { roleRoutes } from "./role.route"
import { authRoutes } from "./auth.route"
import * as authController from "../../controllers/admin/auth.controller"

const adminRoutes = (app: Express): void => {

    const PATH_ADMIN = `/${systemConfig.prefixAdmin}`;

    app.get(PATH_ADMIN, authController.login);

    app.use(`${PATH_ADMIN}/auth`, authRoutes);
    app.use(`${PATH_ADMIN}/categories`, authMiddleware.requireAuth, categoryRoutes);
    app.use(`${PATH_ADMIN}/tours`, authMiddleware.requireAuth, tourRoutes);
    app.use(`${PATH_ADMIN}/upload`, authMiddleware.requireAuth, uploadRoutes);
    app.use(`${PATH_ADMIN}/orders`, authMiddleware.requireAuth, orderRoutes);
    app.use(`${PATH_ADMIN}/accounts`, authMiddleware.requireAuth, accountRoutes);
    app.use(`${PATH_ADMIN}/roles`, authMiddleware.requireAuth, roleRoutes);

};

export default adminRoutes;