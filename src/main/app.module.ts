import { DynamicModule, Logger } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { OpenTelemetryModule } from "nestjs-otel";
import { AppService } from "./app.service";
import { HealthModule } from "./core/health/health.module";
import { TodoModule } from "./modules/todo/infrastructure/todo.module";
import { DatabaseModule } from "./modules/adapters/database/database.module";
import { StorageModule } from "./modules/adapters/storage/storage.module";
import { EventModule } from "./modules/adapters/event/event.module";

interface AppModuleOptions {
    config?: Record<string, any>;
}

export class AppModule {
    static bootstrap(options?: AppModuleOptions): DynamicModule {
        return {
            module: AppModule,
            providers: [Logger, AppService],
            imports: [
                HealthModule,
                TodoModule,
                OpenTelemetryModule.forRoot(),
                ConfigModule.forRoot({
                    isGlobal: true,
                    load: [() => options?.config || {}]
                }),
                DatabaseModule,
                StorageModule,
                EventModule
            ]
        };
    }
}
