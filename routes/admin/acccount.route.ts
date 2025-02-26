import { Router } from "express";
const router: Router = Router();

import * as controller from "../../controllers/admin/account.controller";
import * as uploadCould from "../../middlewares/admin/uploadCloud.middleware";
import multer from "multer";
const upload = multer();

router.get("/", controller.index);
router.get("/create", controller.create);
router.post("/create", upload.single("avatar"), uploadCould.uploadSingle, controller.createPost);
router.get("/detail/:id", controller.detail);
router.get("/edit/:id", controller.edit);
router.patch("/edit/:id", upload.single("avatar"), uploadCould.uploadSingle, controller.editPatch);
router.patch("/change-status/:status/:id", controller.changeStatus);

export const accountRoutes: Router = router;