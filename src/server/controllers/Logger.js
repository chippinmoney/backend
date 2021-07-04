const winston = require('winston')
const { format } = winston
const { combine, timestamp, label, printf } = format

const logFormat = printf(({ level, message, label, timestamp }) => {
    return `${timestamp} ${level.toUpperCase()}: ${message}`;
});

const logger = winston.createLogger({
    format: combine(
      label({label: ''}),
      timestamp(),
      logFormat
    ),
    defaultMeta: { service: 'user-service' },
    transports: [
        new winston.transports.File({filename: 'logs/default.log' }),
        new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
    ]
})

if (process.env.NODE_ENV !== 'production') {
    logger.add(new winston.transports.Console({
        format: combine(
            label({label: ''}),
            timestamp(),
            logFormat
          ),
    }))
}

class Logger {
    constructor() { }

    error(message) { logger.error(JSON.stringify(message)) }
    warn(message) { logger.warn(JSON.stringify(message)) }
    info(message) { logger.info(JSON.stringify(message)) }
    http(message) { logger.http(JSON.stringify(message)) }
    verbose(message) { logger.verbose(JSON.stringify(message)) }
    debug(message) { logger.debug(JSON.stringify(message)) }
    silly(message) { logger.silly(JSON.stringify(message)) }
}

module.exports = {
    Logger
}

