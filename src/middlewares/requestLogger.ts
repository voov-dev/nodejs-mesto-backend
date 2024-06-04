import 'winston-daily-rotate-file';

import expressWinston from 'express-winston';
import winston from 'winston';

export const requestLogger = expressWinston.logger({
  transports: [
    new winston.transports.DailyRotateFile({
      filename: 'logs/request-%DATE%.log',
      datePattern: 'HH-DD-MM-YYYY',
    }),
  ],
  format: winston.format.json(),
});
