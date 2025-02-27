import { Router } from "express";
const router: Router = Router();

import * as controller from "../../controllers/admin/user.controller";

router.get("/", controller.index);
router.get("/detail/:id", controller.detail);
router.patch("/change-status/:status/:id", controller.changeStatus);
router.delete("/delete/:id", controller.deleteUser);

export const userRoutes: Router = router;