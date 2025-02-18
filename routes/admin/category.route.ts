import { Router } from "express";
const router: Router = Router();

import * as controller from "../../controllers/admin/category.controller";
import * as uploadCould from "../../middlewares/admin/uploadCloud.middleware";
import * as categoryValidate from "../..//validates/admin/category.validate";
import multer from "multer";
const upload = multer();

router.get("/", controller.index);
router.get("/create", controller.create);
router.post("/create", upload.single("avatar"), uploadCould.uploadSingle, categoryValidate.createCategory, controller.createPost);
router.get("/edit/:id", controller.edit);
router.patch("/edit/:id", upload.single("avatar"), uploadCould.uploadSingle, categoryValidate.createCategory, controller.editPatch);

export const categoryRoutes: Router = router;