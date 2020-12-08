import 'source-map-support/register';
import http from 'http';
import https from 'https';
import fs from 'fs';
import path from 'path';

import App from '@/main/App';

const port: number = Number(process.env.PORT) || 3000;
const options = {
  key: fs.readFileSync(path.resolve(__dirname, '../cert/private.key')),
  cert: fs.readFileSync(path.resolve(__dirname, '../cert/certificate.crt')),
  ca: fs.readFileSync(path.resolve(__dirname, '../cert/ca_bundle.crt'))
};


if (process.env.NODE_ENV === 'production')
  https.createServer(options, App).listen(port, () =>
    console.log(`Express https server listening at ${port}`)
  ).on('error', err => console.error(err));
else
  http.createServer(App).listen(port, () =>
    console.log(`Express http server listening at ${port}`)
  ).on('error', err => console.error(err));

