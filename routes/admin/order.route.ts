import { Router } from "express";
const router: Router = Router();

import * as controller from "../../controllers/admin/order.controller";

router.get("/", controller.index);
router.get("/detail/:id", controller.detail);
router.delete("/delete/:id", controller.deleteOrder);
router.patch("/change-status/:status/:id", controller.changeStatus);

export const orderRoutes: Router = router;