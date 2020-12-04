import { Router } from 'express';

import videoRouter from '@/main/routes/video';

const router = Router();

router.use('/video', videoRouter);

export default router;
