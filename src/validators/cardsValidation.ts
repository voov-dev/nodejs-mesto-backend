import { celebrate, Joi, Segments } from 'celebrate';

export const createCardVerifyRequest = celebrate({
  [Segments.BODY]: Joi.object().keys({
    name: Joi.string().min(2).max(30).required(),
    link: Joi.string().uri().required(),
  }),
});

export const deleteCardVerifyRequest = celebrate({
  [Segments.PARAMS]: Joi.object().keys({
    cardId: Joi.string().length(24).hex().required(),
  }),
});

export const likeCardVerifyRequest = celebrate({
  [Segments.PARAMS]: Joi.object().keys({
    cardId: Joi.string().length(24).hex().required(),
  }),
});

export const dislikeCardVerifyRequest = celebrate({
  [Segments.PARAMS]: Joi.object().keys({
    cardId: Joi.string().length(24).hex().required(),
  }),
});
