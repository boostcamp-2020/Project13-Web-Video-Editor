import express from 'express';
import { errorHandler } from '@/main/utils/handler';

interface httpError {
  message: string;
  status: number;
}

const lastErrorHandler = (app: express.Application) => {
  app.use(
    (
      req: express.Request,
      res: express.Response,
      next: express.NextFunction
    ) => {
      const err = Object.assign(new Error('Not Found'), { status: 404 });
      next(err);
    }
  );

  app.use(
    (
      err: httpError,
      req: express.Request,
      res: express.Response,
      next: express.NextFunction
    ) => {
      errorHandler(res, err.status || 500, err.message);
    }
  );
};

export default lastErrorHandler;
