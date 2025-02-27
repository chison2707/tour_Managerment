import { Router } from 'express';
const router: Router = Router();
import * as controller from "../../controllers/client/categories.controller";

router.get('/', controller.index);

export const categoriesRoutes: Router = router;