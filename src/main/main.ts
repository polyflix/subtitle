import { Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { isLocal } from "./configuration/loader.config";
import { DevLogger, JsonLogger } from "./configuration/logger.config";

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: isLocal ? DevLogger : JsonLogger
  });

  const config = app.get<ConfigService>(ConfigService);
  const logger = app.get<Logger>(Logger);

  const port = config.get<number>("server.port", 3000);

  await app.listen(port, () => {
    logger.log(`Server listening on port ${port}`, "NestApplication");
  });
}

bootstrap();
