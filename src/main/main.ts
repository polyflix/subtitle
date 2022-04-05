import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { loadConfiguration } from "./configuration/loader.config";
import { logger } from "./configuration/logger.config";
import { configureOTel } from "./configuration/tracing.config";

async function bootstrap() {
  const config = loadConfiguration(logger);

  // Must be started before NestFactory
  const telemetry = configureOTel(config, logger);
  telemetry.start();

  // Gracefully shutdown OTel data, it ensures that all data
  // has been dispatched before shutting down the server
  process.on("SIGTERM", () => {
    telemetry.shutdown().finally(() => process.exit(0));
  });

  const app = await NestFactory.create(AppModule.bootstrap({ config }), {
    logger
  });

  const port = config["server.port"] || 3000;

  await app.listen(port, () => {
    logger.log(`Server listening on port ${port}`, "NestApplication");
  });
}

bootstrap();
