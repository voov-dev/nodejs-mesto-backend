import { Router } from 'express';

import controller from '../controllers/users';
import { createUserVerifyRequest } from '../validators/userValidation';

const signUpRouter = Router();

signUpRouter.post('/', createUserVerifyRequest, controller.createUser);

export default signUpRouter;
