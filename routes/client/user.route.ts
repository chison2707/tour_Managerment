import { Router } from 'express';
const router: Router = Router();
import * as controller from "../../controllers/client/user.controller";

router.get('/login', controller.login);
// router.get('/detail/:slugTour', controller.detail);

export const userRoutes: Router = router;