import * as express from 'express';
import * as cookieParser from 'cookie-parser';

import authController from '../controllers/auth_controller';
import asyncHandler from '../utils/async_handler';

const router = express.Router();

router.use(express.urlencoded({ extended: true }));
router.use(express.json());
router.use(cookieParser());

// sign up
router.post('/signup', asyncHandler(authController.signUp));

// sign in
router.post('/signin', asyncHandler(authController.signIn));

// change password
router.post(
  '/reset',
  asyncHandler(authController.authorize),
  asyncHandler(authController.changePassword),
);

export default router;
