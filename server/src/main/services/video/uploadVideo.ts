import express from 'express';

require('dotenv').config();
const AWS = require('aws-sdk');
const { v4: uuidv4 } = require('uuid');

const endpoint = new AWS.Endpoint('https://kr.object.ncloudstorage.com');
const region = process.env.ACCESS_KEY;

const S3 = new AWS.S3({
  endpoint,
  region,
  credentials: {
    accessKeyId: process.env.ACCESS_KEY,
    secretAccessKey: process.env.ACCESS_SECRET_KEY,
  },
});

const uploadVideo = async (req: any, res: express.Response) => {
  const fileKey = `${uuidv4()}.${req.file.mimetype.split('/')[1]}`;
  await S3.putObject({
    Bucket: process.env.BUCKET_NAME,
    Key: fileKey,
    ACL: 'public-read',
    Body: req.file.buffer,
  })
    .promise()
    .then(data => {
      if (data.$response.httpResponse.statusCode === 200) {
        const url = [endpoint, process.env.BUCKET_NAME, fileKey].join('/');
        res.json(url);
      } else res.sendStatus(500);
    })
    .catch(() => {
      res.sendStatus(500);
    });
};

export default uploadVideo;
