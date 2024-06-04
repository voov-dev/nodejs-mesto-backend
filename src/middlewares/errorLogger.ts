import 'winston-daily-rotate-file';

import expressWinston from 'express-winston';
import winston from 'winston';

export const errorLogger = expressWinston.errorLogger({
  transports: [
    new winston.transports.DailyRotateFile({
      filename: 'logs/error-%DATE%.log',
      datePattern: 'HH-DD-MM-YYYY',
    }),
  ],
  format: winston.format.json(),
});
