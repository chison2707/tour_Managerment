import { Express } from "express";
import { tourRoutes } from "./tour.route";
import { categoriesRoutes } from "./categories.route";
import { cartRoutes } from "./cart.route";
import { orderRoutes } from "./order.route";
import { homeRoutes } from "./home.route";

const clientRoutes = (app: Express): void => {

    app.use('/', homeRoutes)
    app.use('/tours', tourRoutes);
    app.use('/categories', categoriesRoutes);
    app.use('/cart', cartRoutes);
    app.use('/order', orderRoutes);
}

export default clientRoutes;