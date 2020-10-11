import * as express from 'express';
import * as cookieParser from 'cookie-parser';

import urlController from '../controllers/url_controller';
import authController from '../controllers/auth_controller';

const router = express.Router();

router.use(express.urlencoded({ extended: true }));
router.use(express.json());
router.use(cookieParser());

// shorten url
router.post('/', authController.identify, urlController.shortenUrl);

// get own urls
router.get('/', authController.authorize, urlController.getUrls);

// delete url
router.delete(
  '/:endpoint([0-9A-Za-z]{6})',
  authController.authorize,
  urlController.deleteUrl,
);

// get url
router.get('/:endpoint([0-9A-Za-z]{6})', urlController.getUrl);

export default router;
