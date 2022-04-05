import { AsyncLocalStorageContextManager } from "@opentelemetry/context-async-hooks";
import { CompositePropagator, W3CBaggagePropagator, W3CTraceContextPropagator } from "@opentelemetry/core";
import { OTLPTraceExporter } from "@opentelemetry/exporter-trace-otlp-grpc";
import { WinstonInstrumentation } from "@opentelemetry/instrumentation-winston";
import { Resource } from "@opentelemetry/resources";
import { NodeSDK } from "@opentelemetry/sdk-node";
import { BatchSpanProcessor } from "@opentelemetry/sdk-trace-base";
import { SemanticResourceAttributes, TelemetrySdkLanguageValues } from "@opentelemetry/semantic-conventions";
import { OpenTelemetryModule } from "nestjs-otel";

const otelExporter = new OTLPTraceExporter({
    url: 'localhost:4317'
})

/**
 * Configuration of OpenTelemetry tracing system
 */
const otelSDK = new NodeSDK({
    resource: new Resource({
        [SemanticResourceAttributes.SERVICE_NAME]: "boilerplate",
        [SemanticResourceAttributes.TELEMETRY_SDK_LANGUAGE]: TelemetrySdkLanguageValues.NODEJS,
    }), 
    spanProcessor: new BatchSpanProcessor(otelExporter),
    traceExporter: otelExporter,
    contextManager: new AsyncLocalStorageContextManager(),
    instrumentations: [
        new WinstonInstrumentation()
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

export default otelSDK

/**
 * Gracefully shutdown OTel data, it ensures that all data
 * has been dispatched before shutting down the server
 */
process.on('SIGTERM', () => {
    otelSDK.shutdown()
    .finally(() => process.exit(0));
})

/**
 * NestJS OTel configuration
 * See @pragmaticivan/nestjs-otel
 */
const OpenTelemetryModuleConfig = OpenTelemetryModule.forRoot();
export { OpenTelemetryModuleConfig };