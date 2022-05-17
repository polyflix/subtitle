import { Global, Module } from "@nestjs/common";
import { KAFKA_CLIENT, microserviceConfig } from "../../../config/kafka.config";
import { ConfigService } from "@nestjs/config";
import { ClientProxyFactory } from "@nestjs/microservices";

@Global()
@Module({
    providers: [
        {
            provide: KAFKA_CLIENT,
            useFactory: (configService: ConfigService) => {
                return ClientProxyFactory.create(
                    microserviceConfig(configService.get("kafka"))
                );
            },
            inject: [ConfigService]
        }
    ],

    exports: [KAFKA_CLIENT]
})
export class EventModule {}
