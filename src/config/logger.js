import winston from 'winston';

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine((        // combining different formatters instead of simple JSON
    winston.format.timestamp(),
    winston.format.errors({stack: true}),  // I wanna see the entire stack of errors
    winston.format.json()                  // and then JSON
  )),
  defaultMeta: { service: 'acquisitions-api' },
  transports: [
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
    new winston.transports.File({ filename: 'logs/combined.log' }),
  ],
});

if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.combine(
      winston.format.colorize(),
      winston.format.simple(),
    ),
  }));
}

export default logger;