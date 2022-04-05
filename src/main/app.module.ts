import { Logger, Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { OpenTelemetryModule } from "nestjs-otel";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import configuration from "./configuration/loader.config";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration]
    }),
    OpenTelemetryModule,
  ],
  controllers: [AppController],
  providers: [AppService, Logger]
})
export class AppModule {}
