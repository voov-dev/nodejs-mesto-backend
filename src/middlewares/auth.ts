import { NextFunction, Response } from 'express';
import jwt from 'jsonwebtoken';

import BadRequestError from '../common/BadRequestError';
import { AuthorizationRequest } from '../common/types/AuthorizationRequest';

const {
  JWT_SECRET = 'eyJhbGciOiJIUzI1NiJ9.eyJSb2xlIjoiQWRtaW4iLCJleHAiOjE4NDM1Nzk0ODEsImlhdCI6MTcxNzM0OTA4MX0.XDHPxtgr_NX8qkaJp2f2-jFo_xY4uGpt0QiO9mIT-HM',
} = process.env;

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
