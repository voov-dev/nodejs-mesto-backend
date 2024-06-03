import { celebrate, Joi, Segments } from 'celebrate';

import { DEFAULT_USER } from '../common/constants/defaultUser';

export const createUserVerifyRequest = celebrate({
  [Segments.BODY]: Joi.object({
    name: Joi.string().min(2).max(30).allow('', null).default(DEFAULT_USER.name),
    about: Joi.string().min(2).max(200).allow('', null).default(DEFAULT_USER.about),
    avatar: Joi.string().uri().allow('', null).default(DEFAULT_USER.avatar),
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  }),
});

export const loginUserVerifyRequest = celebrate({
  [Segments.BODY]: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  }),
});

export const updatedUserInfoVerifyRequest = celebrate({
  [Segments.BODY]: Joi.object({
    name: Joi.string().min(2).max(30).allow('', null).default(DEFAULT_USER.name).required(),
    about: Joi.string().min(2).max(200).allow('', null).default(DEFAULT_USER.about).required(),
  }),
});

export const updatedUserAvatarVerifyRequest = celebrate({
  [Segments.BODY]: Joi.object({
    avatar: Joi.string().uri().allow('', null).default(DEFAULT_USER.avatar).required(),
  }),
});
