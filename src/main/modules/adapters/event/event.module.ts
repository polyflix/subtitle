import { Global, Module } from "@nestjs/common";
import { KAFKA_CLIENT, microserviceConfig } from "../../../config/kafka.config";
import { ConfigService } from "@nestjs/config";
import { ClientProxyFactory } from "@nestjs/microservices";
import { KafkaSubtitlePublisher } from "./kafka-subtitlePublisher";
import { KafkaVideoConsumer } from "./kafka-video-consumer";
import { SubtitlePublisher } from "../../domain/ports/SubtitlePublisher";

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
    controllers: [KafkaVideoConsumer],
    exports: [KAFKA_CLIENT]
})
export class EventModule {}
