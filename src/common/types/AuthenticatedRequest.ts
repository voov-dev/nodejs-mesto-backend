import { Request } from 'express';

export type AuthenticatedRequest = Request & {
  user?: {
    _id: string;
  };
};
