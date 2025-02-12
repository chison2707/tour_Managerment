import { Express } from "express";
import { tourRoutes } from "./tour.route";
import { categoriesRoutes } from "./categories.route";
import { cartRoutes } from "./cart.route";
import { orderRoutes } from "./order.route";
import { homeRoutes } from "./home.route";
import { userRoutes } from "./user.route";

import * as userMiddleware from "../../middlewares/client/use.middleware";

const clientRoutes = (app: Express): void => {
    app.use(userMiddleware.infoUser);

    app.use('/', homeRoutes)
    app.use('/tours', tourRoutes);
    app.use('/categories', categoriesRoutes);
    app.use('/users', userRoutes);
    app.use('/cart', cartRoutes);
    app.use('/order', orderRoutes);
}

export default clientRoutes;