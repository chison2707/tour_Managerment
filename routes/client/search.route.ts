import { Router } from 'express';
const router: Router = Router();
const controller = require("../../controllers/client/search.controller");

router.get('/', controller.index);

export const searchRoutes: Router = router;