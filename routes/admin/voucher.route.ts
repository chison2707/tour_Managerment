import { Router } from "express";
const router: Router = Router();

import * as controller from "../../controllers/admin/voucher.controllers";

router.get("/", controller.index);

export const voucherRoutes: Router = router;