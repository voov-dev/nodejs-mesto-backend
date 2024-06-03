import { Router } from 'express';

import cardRouter from './cards';
import userRouter from './users';

const router = Router();

router.use('/users', userRouter);
router.use('/cards', cardRouter);

export default router;
