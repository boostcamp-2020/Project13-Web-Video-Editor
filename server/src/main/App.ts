import express from 'express';
import loader from '@/main/loaders';

const app: express.Application = express();

const startServer = () => {
  loader.init(app);
};

startServer();

export default app;
