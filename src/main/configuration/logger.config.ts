import { WinstonModule } from "nest-winston";
import * as winston from "winston";
import * as opentelemetry from "@opentelemetry/api"
import { Format, format } from "logform";
import  { context, trace as otelTrace, Span } from "@opentelemetry/api"

/**
 * Instrumentation packages for winston aren't that great for now and
 * aren't working with current nest-winston module. So I created a 
 * custom tracingFormat which contain general information in order to
 * correlate logs & traces
 * 
 * Only shown in production logs format, it's not relevant for development
 * environments.
 */
function tracingFormat(): Format {
  const tracer = otelTrace.getTracer('logform');
  return format(info => {
    const span: Span | undefined = otelTrace.getSpan(context.active());
    if (span) {
      const context = span.spanContext();
      info['trace.id'] = context.traceId;
      info['span.id'] = context.spanId;
    }
    return info;
  })();
}

export const JsonLogger = WinstonModule.createLogger({
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        tracingFormat(),
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
