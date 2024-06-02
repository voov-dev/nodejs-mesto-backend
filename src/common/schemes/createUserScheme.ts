import Joi from 'joi';

import { User } from '../types/User';

export const createUserScheme = Joi.object<User>({
  name: Joi.string().min(2).max(30),
  about: Joi.string().min(2).max(30),
  avatar: Joi.string().uri(),
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});
