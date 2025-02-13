import { Router } from 'express';
const router: Router = Router();
import * as controller from "../../controllers/client/order.controller";
import { requireAuth } from '../../middlewares/client/auth.middleware';

router.post('/', requireAuth, controller.order);
router.get('/success', requireAuth, controller.success);

export const orderRoutes: Router = router;