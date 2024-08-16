import winston, { createLogger, format, transports } from 'winston';
import { Console } from 'winston/lib/winston/transports';

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
    new transports.File({ filename: '.errors/error.log', level: 'error' }),
    new transports.File({ filename: '.errors/combined.log' }),
  ],
});

if (process.env.NODE_ENV !== 'production') {
  logger.add(
    new Console({
      format: winston.format.simple(),
    })
  );
}

export default logger;
