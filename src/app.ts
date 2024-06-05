import { errors } from 'celebrate';
import express, { json, NextFunction, Request, Response } from 'express';
import mongoose from 'mongoose';

import BadRequestError from './common/BadRequestError';
import { HTTP_STATUS_CODE } from './common/enums/httpStatusCode';
import { createUser, login } from './controllers/users';
import { auth } from './middlewares/auth';
import { errorLogger } from './middlewares/errorLogger';
import { requestLogger } from './middlewares/requestLogger';
import routes from './routes';
import { createUserVerifyRequest, loginUserVerifyRequest } from './validators/userValidation';

const { PORT = 3000, MONGODB_DEV = 'mongodb://127.0.0.1:27017/mestodb' } = process.env;
const app = express();

app.use(json());
app.use(requestLogger);
app.post('/signin', loginUserVerifyRequest, login);
app.post('/signup', createUserVerifyRequest, createUser);
app.use(auth);
app.use('/', auth, routes);
app.use(errorLogger);
app.use(errors());
app.use((err: BadRequestError, req: Request, res: Response, next: NextFunction) => {
  const { statusCode = HTTP_STATUS_CODE.UNKNOWN_ERROR, message } = err;

  res.status(statusCode).send({
    message: statusCode === HTTP_STATUS_CODE.UNKNOWN_ERROR ? 'На сервере произошла ошибка' : message,
  });

  next();
});

const main = async () => {
  try {
    mongoose.set('strictQuery', true);
    await mongoose.connect(MONGODB_DEV);

    app.listen(PORT, () => console.info('Сервер успешно стартовал, порт: ', PORT));
  } catch (error) {
    console.error(error);
  }
};

main();
