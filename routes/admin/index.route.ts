import { Express } from "express";
import { categoryRoutes } from "./category.route";
import { systemConfig } from "../../config/system";
import { tourRoutes } from "./tour.route";
import { orderRoutes } from "./order.route";
import { uploadRoutes } from "./upload.route"
import { accountRoutes } from "./acccount.route"
import { roleRoutes } from "./role.route"

const adminRoutes = (app: Express): void => {

    const PATH_ADMIN = `/${systemConfig.prefixAdmin}`;

    app.use(`${PATH_ADMIN}/categories`, categoryRoutes);
    app.use(`${PATH_ADMIN}/tours`, tourRoutes);
    app.use(`${PATH_ADMIN}/upload`, uploadRoutes);
    app.use(`${PATH_ADMIN}/orders`, orderRoutes);
    app.use(`${PATH_ADMIN}/accounts`, accountRoutes);
    app.use(`${PATH_ADMIN}/roles`, roleRoutes);

};

export default adminRoutes;