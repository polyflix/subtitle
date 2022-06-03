import { DynamicModule, Logger } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { OpenTelemetryModule } from "nestjs-otel";
import { AppService } from "./app.service";
import { HealthModule } from "./core/health/health.module";
import { DatabaseModule } from "./modules/adapters/database/database.module";
import { StorageModule } from "./modules/adapters/storage/storage.module";
import { EventModule } from "./modules/adapters/event/event.module";
import { ApiModule } from "./modules/adapters/api/api.module";
import { DomainServicesModule } from "./modules/domain/services/domain-services.module";
import { TracingInjectionInterceptor } from "./core/tracing.interceptor";
import { APP_INTERCEPTOR } from "@nestjs/core";

interface AppModuleOptions {
    config?: Record<string, any>;
}

export class AppModule {
    static bootstrap(options?: AppModuleOptions): DynamicModule {
        return {
            module: AppModule,
            providers: [
                Logger,
                AppService,
                {
                    provide: APP_INTERCEPTOR,
                    useClass: TracingInjectionInterceptor
                }
            ],
            imports: [
                HealthModule,
                OpenTelemetryModule.forRoot(),
                ConfigModule.forRoot({
                    isGlobal: true,
                    load: [() => options?.config || {}]
                }),
                DatabaseModule,
                StorageModule,
                EventModule,
                ApiModule,
                DomainServicesModule
            ]
        };
    }
}
