import { createLogger, format, transports } from 'winston';

const logger = createLogger({
  level: 'info',
  format: format.combine(
    format.colorize(),
    format.timestamp(),
    format.printf(
      ({ timestamp, level, message }) => `\n${timestamp} ${level}: ${message}\n`
    )
  ),
  transports: [
    new transports.Console(),
    new transports.File({ filename: '.errors/error.log', level: 'error' }),
    new transports.File({ filename: '.errors/combined.log' }),
  ],
});

export default logger;
