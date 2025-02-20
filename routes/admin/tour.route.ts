import { Router } from "express";
import multer from "multer";
const router: Router = Router();

import * as controller from "../../controllers/admin/tour.controller";
import * as uploadCloud from "../../middlewares/admin/uploadCloud.middleware";
const upload = multer();

router.get("/", controller.index);
router.get("/create", controller.create);
router.post(
    "/create",
    upload.fields([{ name: 'images', maxCount: 10 }]),
    uploadCloud.uploadFields,
    controller.createPost
);
router.get("/edit/:id", controller.edit);
router.patch("/edit/:id", upload.fields([{ name: 'images', maxCount: 10 }]),
    uploadCloud.uploadFields, controller.editPatch);
router.patch("/change-status/:status/:id", controller.changeStatus);
router.delete("/delete/:id", controller.deleteTour);

export const tourRoutes: Router = router;