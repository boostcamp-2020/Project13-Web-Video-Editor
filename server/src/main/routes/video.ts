import { Router } from 'express';
import uploadVideo from '@/main/services/video/uploadVideo';
import setMulter from '@/main/services/video/setMulter';

const router = Router();

router.post('/video', setMulter, uploadVideo);

export default router;
