import 'source-map-support/register';
import App from '@/main/App';

const port: number = Number(process.env.PORT) || 3000;

App.listen(port, () =>
  console.log(`Express server listening at ${port}`)
).on('error', err => console.error(err));
