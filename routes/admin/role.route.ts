import { Router } from "express";
const router: Router = Router();

import * as controller from "../../controllers/admin/role.controller";

router.get("/", controller.index);
router.get("/create", controller.create);
router.post("/create", controller.createPost);
router.get('/detail/:id', controller.detail);

export const roleRoutes: Router = router;