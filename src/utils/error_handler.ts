import { Request, Response, NextFunction } from 'express';
import logger from './logger';

export function clientErrorHandler(
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const errString = err.toString();

  if (/AssertionError/.test(errString)) {
    const [status, message] = err.message.split(':');
    return res.status(parseInt(status)).json({
      error: { message: message },
    });
  }

  if (/ValidationError/.test(errString)) {
    const [, , message] = err.message.split(': ');
    return res.status(400).json({
      error: { message: message },
    });
  }

  next();
}

export function serverErrorHandler(
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction,
) {
  logger.error(err);

  return res.status(500).json({
    error: { message: 'Internal server error' },
  });
}
