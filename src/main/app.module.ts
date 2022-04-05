import { DynamicModule, Logger } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { OpenTelemetryModule } from "nestjs-otel";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";

interface AppModuleOptions {
  config?: Record<string, any>;
}

export class AppModule {
  static bootstrap(options?: AppModuleOptions): DynamicModule {
    return {
      module: AppModule,
      imports: [
        OpenTelemetryModule.forRoot(),
        ConfigModule.forRoot({
          isGlobal: true,
          load: [() => options?.config || {}]
        })
      ],
      controllers: [AppController],
      providers: [AppService, Logger],
      exports: []
    };
  }
}
