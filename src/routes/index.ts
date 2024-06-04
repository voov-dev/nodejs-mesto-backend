import { Router } from 'express';

import cardsRouter from './cards';
import userRouter from './users';

const router = Router();

router.use('/users', userRouter);
router.use('/cards', cardsRouter);

export default router;
