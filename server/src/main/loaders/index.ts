import express from 'express';
import expressLoader from '@/main/loaders/express';
import lastErrorHandler from '@/main/loaders/errorHandler';

const init = (app: express.Application) => {
  expressLoader(app);
  lastErrorHandler(app);
};

export default { init };
