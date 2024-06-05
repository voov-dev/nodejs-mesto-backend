import { NextFunction, Response } from 'express';
import jwt from 'jsonwebtoken';

import BadRequestError from '../common/BadRequestError';
import { AuthorizationRequest } from '../common/types/AuthorizationRequest';

const { JWT_SECRET = '' } = process.env;

export const auth = (req: AuthorizationRequest, res: Response, next: NextFunction) => {
  const { cookie } = req.headers;
  if (!cookie) throw new BadRequestError('Необходима авторизация');

  try {
    const payload = jwt.verify(cookie.replace('jwt=', ''), JWT_SECRET, { algorithms: ['HS256'] });

    req.user = payload;
  } catch (err) {
    return next(err);
  }

  next();
};
