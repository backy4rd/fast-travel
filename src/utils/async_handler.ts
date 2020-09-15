import { Request, Response, NextFunction, RequestHandler } from 'express';

export default (middleware: RequestHandler): RequestHandler => {
  return (req: Request, res: Response, next: NextFunction) => {
    middleware(req, res, next).catch(next);
  };
};
