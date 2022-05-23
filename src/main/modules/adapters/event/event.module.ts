import { Global, Module } from "@nestjs/common";
import { KAFKA_CLIENT, microserviceConfig } from "../../../config/kafka.config";
import { ConfigService } from "@nestjs/config";
import { ClientProxyFactory } from "@nestjs/microservices";
import { SubtitlePublisher } from "../../domain/ports/subtitlePublisher";
import { KafkaSubtitlePublisher } from "./kafka-subtitlePublisher";
import { KafkaSubtitleConsumer } from "./kafka-subtitleConsumer";

@Global()
@Module({
    providers: [
        {
            provide: KAFKA_CLIENT,
            useFactory: (configService: ConfigService) => {
                if (!configService.get("kafka"))
                    throw new Error(
                        "Kafka config is undefined, invalid config"
                    );

                return ClientProxyFactory.create(
                    microserviceConfig(configService.get("kafka"))
                );
            },
            inject: [ConfigService]
        },
        {
            provide: SubtitlePublisher,
            useClass: KafkaSubtitlePublisher
        }
    ],
    controllers: [KafkaSubtitleConsumer],
    exports: [KAFKA_CLIENT]
})
export class EventModule {}
