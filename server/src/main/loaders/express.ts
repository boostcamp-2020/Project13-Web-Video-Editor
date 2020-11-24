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
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));
};

export default expressLoader;
