import express from 'express';
import cors from 'cors';
import indexRouter from '@/main/routes';

const expressLoader = app => {
  app.use(
    cors({
      origin: true,
      credentials: true,
    })
  );
  app.use('/', indexRouter);
};

export default expressLoader;
