import { Express } from 'express';
import AWS from 'aws-sdk';

import { retrieveByUser, create } from '../model/video';

require('dotenv').config();

const USER_ID = 1; // FIXME: token authorization

const endpoint = new AWS.Endpoint('https://kr.object.ncloudstorage.com');
const region = process.env.REGION;
const S3 = new AWS.S3({
  endpoint,
  region,
  credentials: {
    accessKeyId: process.env.ACCESS_KEY,
    secretAccessKey: process.env.ACCESS_SECRET_KEY,
  },
});

const upload = async (file: Express.Multer.File) => {
  const folderName = `USER${USER_ID}`;
  const fileKey = `${folderName}/${file.originalname}`;
  const {
    $response: { httpResponse },
  } = await S3.putObject({
    Bucket: process.env.BUCKET_NAME,
    Key: fileKey,
    ACL: 'public-read',
    Body: file.buffer,
  }).promise();

  if (httpResponse.statusCode !== 200)
    throw Object.assign(new Error(httpResponse.statusMessage), {
      status: httpResponse.statusCode,
    });
  const url = `${endpoint.href}${process.env.BUCKET_NAME}/${fileKey}`;
  const id = await create(USER_ID, fileKey, url);
  return { url, id };
};

const download = () => {
  return null;
};

const getByUser = async (id: number) => {
  const videos = await retrieveByUser(id);
  return videos;
};

export default { upload, download, getByUser };
