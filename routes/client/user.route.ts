import { Router } from 'express';
const router: Router = Router();
import * as controller from "../../controllers/client/user.controller";
import * as validate from "../../validates/client/user.validate";

router.get('/login', controller.login);
router.get('/register', controller.register);
router.post('/register', validate.registerPost, controller.registerPost);
router.post('/login', controller.loginPost);
router.get('/logout', controller.logout);
router.get('/password/forgot', controller.forgotPass);
router.post('/password/forgot', controller.forgotPassPost);
router.get('/password/otp', controller.otpPassword);
router.post('/password/otp', controller.otpPasswordPost);
router.get('/password/reset', controller.resetPassword);
router.post('/password/reset', validate.resetPasswordPost, controller.resetPasswordPost);

export const userRoutes: Router = router;