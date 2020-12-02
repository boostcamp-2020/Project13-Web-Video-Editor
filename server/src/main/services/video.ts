import { Express } from 'express';
import AWS from 'aws-sdk';
import { v4 as uuidv4 } from 'uuid';

import { retrieveByUser } from '../model/video';

require('dotenv').config();

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
  const fileKey = `${uuidv4()}.${file.mimetype.split('/')[1]}`;

  const {
    $response: { httpResponse },
  } = await S3.putObject({
    Bucket: process.env.BUCKET_NAME,
    Key: fileKey,
    ACL: 'public-read',
    Body: file.buffer,
  }).promise();

  if (httpResponse.statusCode === 200) {
    const url = `${endpoint.href}${process.env.BUCKET_NAME}/${fileKey}`;
    return url;
  }

  throw Object.assign(new Error(httpResponse.statusMessage), {
    status: httpResponse.statusCode,
  });
};

const download = () => {
  return null;
};

const getByUser = async (id: number) => {
  const videoList = await retrieveByUser(id);
  return videoList;
};

export default { upload, download, getByUser };
