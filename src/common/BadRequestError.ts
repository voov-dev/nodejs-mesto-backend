import { Error } from 'mongoose';

class BadRequestError extends Error {
  public statusCode: number;

  constructor(message: string) {
    super(message);
    this.statusCode = 400;
    this.message = message;
  }
}

export default BadRequestError;
