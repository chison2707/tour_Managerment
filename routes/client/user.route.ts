import { Router } from 'express';
const router: Router = Router();
import * as controller from "../../controllers/client/user.controller";

router.get('/login', controller.login);
router.get('/register', controller.register);
router.post('/register', controller.registerPost);
router.post('/login', controller.loginPost);

export const userRoutes: Router = router;