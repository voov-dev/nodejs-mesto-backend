import express, { json } from 'express';
import mongoose from 'mongoose';

import { errorLogger } from './middlewares/errorLogger';
import { requestLogger } from './middlewares/requestLogger';
import routes from './routes';

const { PORT = 3000, MONGODB_DEV = 'mongodb://localhost:27017' } = process.env;
const app = express();

app.use(json());
app.use(requestLogger);
app.use('/', routes);
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
