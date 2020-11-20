import { Router } from 'express';

import { uploadVideo } from '@/main/controllers/video';
import setMulter from '@/main/middlewares/multer';

const router = Router();

router.post('/video', setMulter, uploadVideo);

export default router;
