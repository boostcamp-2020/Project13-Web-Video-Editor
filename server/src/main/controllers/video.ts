import express from 'express';
import videoService from '@/main/services/video';
import { FileRequest } from '@/main/middlewares/multer';
import { responseHandler } from '@/main/utils/handler';

export const uploadVideo = async (
  req: FileRequest,
  res: express.Response,
  next: express.NextFunction
) => {
  try {
    const url: string = await videoService.upload(req.file);
    responseHandler(res, 200, { url });
  } catch (err) {
    next(err);
  }
};

export const downloadVideo = (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => { };
