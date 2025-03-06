import { Router } from "express";
const router: Router = Router();

import * as controller from "../../controllers/admin/voucher.controllers";

router.get("/", controller.index);
router.get("/create", controller.create);
router.post("/create", controller.createPost);
router.patch("/change-status/:status/:id", controller.changeStatus);
router.get("/edit/:id", controller.edit);
router.patch("/edit/:id", controller.editPatch);

export const voucherRoutes: Router = router;