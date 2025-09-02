import winston from 'winston';

// Create logger instance
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp({
      format: 'YYYY-MM-DD HH:mm:ss'
    }),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  defaultMeta: { service: 'hero-marketplace-backend' },
  transports: [
    // Write logs to console with colored output
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple(),
        winston.format.printf(({ timestamp, level, message, ...meta }) => {
          return `${timestamp} [${level}]: ${message} ${Object.keys(meta).length ? JSON.stringify(meta, null, 2) : ''}`;
        })
      )
    }),
    // Write logs to file
    new winston.transports.File({ 
      filename: 'logs/error.log', 
      level: 'error' 
    }),
    new winston.transports.File({ 
      filename: 'logs/combined.log' 
    })
  ],
});

// Log transaction operations
export const logTransaction = (
  operation: 'CREATE_HERO' | 'LIST_HERO' | 'BUY_HERO' | 'TRANSFER_HERO',
  sender: string,
  details: any,
  status: 'INITIATED' | 'SUCCESS' | 'ERROR' = 'INITIATED'
) => {
  const logData = {
    operation,
    sender: `${sender.slice(0, 6)}...${sender.slice(-4)}`,
    status,
    details,
    timestamp: new Date().toISOString()
  };

  if (status === 'ERROR') {
    logger.error(`Transaction ${operation} failed`, logData);
  } else if (status === 'SUCCESS') {
    logger.info(`Transaction ${operation} completed successfully`, logData);
  } else {
    logger.info(`Transaction ${operation} initiated`, logData);
  }
};

// Log API requests
export const logRequest = (method: string, endpoint: string, userAgent?: string) => {
  logger.info(`API Request`, {
    method,
    endpoint,
    userAgent: userAgent?.slice(0, 50),
    timestamp: new Date().toISOString()
  });
};

// Log server events
export const logServer = (message: string, meta?: any) => {
  logger.info(message, meta);
};

// Log errors
export const logError = (message: string, error: any, meta?: any) => {
  logger.error(message, {
    error: error.message || error,
    stack: error.stack,
    ...meta
  });
};

export default logger;
