import express, { json } from 'express';
import mongoose from 'mongoose';

import { createUser, login } from './controllers/users';
import { auth } from './middlewares/auth';
import { errorLogger } from './middlewares/errorLogger';
import { requestLogger } from './middlewares/requestLogger';
import routes from './routes';
import { createUserVerifyRequest, loginUserVerifyRequest } from './validators/userValidation';

const { PORT = 3000, MONGODB_DEV = 'mongodb://127.0.0.1:27017' } = process.env;
const app = express();

app.use(json());
app.use(requestLogger);
app.post('/signin', loginUserVerifyRequest, login);
app.post('/signup', createUserVerifyRequest, createUser);
app.use(auth);
app.use('/', auth, routes);
app.use(errorLogger);

const main = async () => {
  try {
    mongoose.set('strictQuery', true);
    await mongoose.connect(MONGODB_DEV);

    app.listen(PORT, () => console.info('Server is started on port', PORT));
  } catch (error) {
    console.error(error);
  }
};

main();
