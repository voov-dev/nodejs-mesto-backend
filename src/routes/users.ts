import { Router } from 'express';

import controller from '../controllers/users';

const userRouter = Router();

userRouter.get('/', controller.getUsers);
userRouter.get('/:userId', controller.getUserById);

export default userRouter;
