import express from 'express';
import videoService from '@/main/services/video';
import { FileRequest } from '@/main/middlewares/multer';

export const uploadVideo = async (
  req: FileRequest,
  res: express.Response,
  next: express.NextFunction
) => {
  try {
    const url: string = await videoService.upload(req.file);
    res.status(200).json(url);
  } catch (err) {
    next(err);
  }
};

export const downloadVideo = (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {};
