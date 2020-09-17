import * as express from 'express';
import * as cookieParser from 'cookie-parser';

import urlController from '../controllers/url_controller';
import authController from '../controllers/auth_controller';
import asyncHandler from '../utils/async_handler';

const router = express.Router();

router.use(express.urlencoded({ extended: true }));
router.use(express.json());
router.use(cookieParser());

// shorten url
router.post(
  '/',
  asyncHandler(authController.authorize({ require: false })),
  asyncHandler(urlController.shortenUrl),
);

// delete url
router.delete(
  '/:endpoint([0-9A-Za-z]{6})',
  asyncHandler(authController.authorize({ require: true })),
  asyncHandler(urlController.deleteUrl),
);

// get url
router.get('/:endpoint([0-9A-Za-z]{6})', asyncHandler(urlController.getUrl));

export default router;
