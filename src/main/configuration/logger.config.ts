import { WinstonModule } from "nest-winston";
import * as winston from "winston";

export const JsonLogger = WinstonModule.createLogger({
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
      )
    })
  ]
});

export const DevLogger = WinstonModule.createLogger({
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.timestamp(),
        winston.format.printf(({ level, message, timestamp, context }) => {
          return `${timestamp} ${level} [${context}]: ${message}`;
        })
      )
    })
  ]
});
