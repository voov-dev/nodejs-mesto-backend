import { Request } from 'express';
import { JwtPayload } from 'jsonwebtoken';

export type AuthorizationRequest = Request & {
  user?: string | JwtPayload;
};
