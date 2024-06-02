import { Router } from 'express';

import cardRouter from './cards';
import signInRouter from './signin';
import signUpRouter from './signup';
import userRouter from './users';

const router = Router();

router.use('/users', userRouter);
router.use('/cards', cardRouter);
router.use('/signup', signUpRouter);
router.use('/signin', signInRouter);

export default router;
