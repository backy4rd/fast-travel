import * as express from 'express';
import { Application, NextFunction, Request, Response } from 'express';

const app: Application = express();

app.use((req: Request, res: Response, next: NextFunction) => {
  req.local = {};
  next();
});

export default app;
