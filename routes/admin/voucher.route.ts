import { Router } from "express";
const router: Router = Router();

import * as controller from "../../controllers/admin/voucher.controllers";
import * as validate from "../../validates/admin/voucher.validate";

router.get("/", controller.index);
router.get("/create", controller.create);
router.post("/create", validate.voucherValidate, controller.createPost);
router.get("/edit/:id", controller.edit);
router.patch("/edit/:id", validate.voucherValidate, controller.editPatch);
router.delete("/delete/:id", controller.deleteVoucher);

export const voucherRoutes: Router = router;