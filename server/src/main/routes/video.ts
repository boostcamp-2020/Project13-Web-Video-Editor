import { Router } from 'express';

import { getVideoList, uploadVideo } from '@/main/controllers/video';
import setMulter from '@/main/middlewares/multer';

const router = Router();

router.get('/list', getVideoList);
router.post('/', setMulter, uploadVideo);

export default router;
