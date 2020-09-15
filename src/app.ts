import * as express from 'express';
import { Application, NextFunction, Request, Response } from 'express';

import authRouter from './routes/auth_router';

const app: Application = express();

app.use((req: Request, res: Response, next: NextFunction) => {
  req.local = {};
  next();
});

app.use(authRouter);

export default app;
