import express, { NextFunction, Express } from 'express';
import multer from 'multer';

const storage = multer.memoryStorage();
const upload = multer({ storage });

const setMulter = (
  req: express.Request,
  res: express.Response,
  next: NextFunction
) => {
  upload.single('video')(req, res, next);
};

export interface FileRequest extends express.Request {
  file: Express.Multer.File;
}

export default setMulter;
