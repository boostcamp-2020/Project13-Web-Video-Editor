import express from 'express';

export const errorHandler = (
  res: express.Response,
  code: number,
  message: string = ''
) => {
  res.status(code).json({
    code,
    message,
  });
};

export const responseHandler = (
  res: express.Response,
  code: number,
  result: object = {}
) => {
  res.status(code).json({
    code,
    success: true,
    ...result,
  });
};
