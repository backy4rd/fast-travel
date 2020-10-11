import * as express from 'express';
import * as cookieParser from 'cookie-parser';

import authController from '../controllers/auth_controller';

const router = express.Router();

router.use(express.urlencoded({ extended: true }));
router.use(express.json());
router.use(cookieParser());

// sign up
router.post('/signup', authController.signUp);

// sign in
router.post('/signin', authController.signIn);

// change password
router.post('/reset', authController.authorize, authController.changePassword);

export default router;
