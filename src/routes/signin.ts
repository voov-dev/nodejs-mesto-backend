import { Router } from 'express';

import controller from '../controllers/users';
import { loginUserVerifyRequest } from '../validators/userValidation';

const signInRouter = Router();

signInRouter.post('/', loginUserVerifyRequest, controller.login);

export default signInRouter;
