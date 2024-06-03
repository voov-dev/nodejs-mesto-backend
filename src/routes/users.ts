import { Router } from 'express';

import { getUserById, getUserData, getUsers, updateUserAvatar, updateUserInfo } from '../controllers/users';
import { updatedUserAvatarVerifyRequest, updatedUserInfoVerifyRequest } from '../validators/userValidation';

const userRouter = Router();

userRouter.get('/', getUsers);
userRouter.get('/me', getUserData);
userRouter.patch('/me', updatedUserInfoVerifyRequest, updateUserInfo);
userRouter.patch('/me/avatar', updatedUserAvatarVerifyRequest, updateUserAvatar);
userRouter.get('/:userId', getUserById);

export default userRouter;
