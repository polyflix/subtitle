import { LoggerService } from "@nestjs/common";
import { AsyncLocalStorageContextManager } from "@opentelemetry/context-async-hooks";
import {
    CompositePropagator,
    W3CBaggagePropagator,
    W3CTraceContextPropagator
} from "@opentelemetry/core";
import { OTLPTraceExporter } from "@opentelemetry/exporter-trace-otlp-grpc";
import { WinstonInstrumentation } from "@opentelemetry/instrumentation-winston";
import { Resource } from "@opentelemetry/resources";
import { NodeSDK } from "@opentelemetry/sdk-node";
import { BatchSpanProcessor } from "@opentelemetry/sdk-trace-base";
import {
    SemanticResourceAttributes,
    TelemetrySdkLanguageValues
} from "@opentelemetry/semantic-conventions";
import { HttpInstrumentation } from "@opentelemetry/instrumentation-http";
import { ExpressInstrumentation } from "@opentelemetry/instrumentation-express";
import { KafkaJsInstrumentation } from "opentelemetry-instrumentation-kafkajs";
import { NestInstrumentation } from "@opentelemetry/instrumentation-nestjs-core";

const LOGGER_CTX = "TracingLoader";

export const configureOTel = (
    config: Record<string, any>,
    logger: LoggerService
) => {
    const otelConfig = {
        port: config["telemetry"]["port"] || 4317,
        endpoint: config["telemetry"]["host"] || "localhost"
    };
    const traceEndpoint = `${otelConfig.endpoint}:${otelConfig.port}`;

    logger.log(`OTel tracing server sending to ${traceEndpoint}`, LOGGER_CTX);
    const otelExporter = new OTLPTraceExporter({
        url: traceEndpoint
    });

    return new NodeSDK({
        resource: new Resource({
            [SemanticResourceAttributes.SERVICE_NAME]: "subtitle",
            [SemanticResourceAttributes.TELEMETRY_SDK_LANGUAGE]:
                TelemetrySdkLanguageValues.NODEJS
        }),
        spanProcessor: new BatchSpanProcessor(otelExporter),
        traceExporter: otelExporter,
        contextManager: new AsyncLocalStorageContextManager(),
        instrumentations: [
            new WinstonInstrumentation(),
            new HttpInstrumentation(),
            new ExpressInstrumentation(),
            new KafkaJsInstrumentation(),
            new NestInstrumentation()
        ],
        textMapPropagator: new CompositePropagator({
            propagators: [
                // Propagate the contexte of the trace
                new W3CTraceContextPropagator(),
                // Propagate data in the header of each requests
                new W3CBaggagePropagator()
            ]
        })
    });
};
