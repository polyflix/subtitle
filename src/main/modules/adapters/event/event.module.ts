import { Global, Module } from "@nestjs/common";
import { KAFKA_CLIENT, microserviceConfig } from "../../../config/kafka.config";
import { ConfigService } from "@nestjs/config";
import { ClientProxyFactory } from "@nestjs/microservices";
import { KafkaSubtitlePublisher } from "./kafka-subtitlePublisher";
import { KafkaVideoConsumer } from "./kafka-video-consumer";
import { SubtitlesPublisher } from "../../domain/ports/SubtitlesPublisher";
import { SubtitleGenerationService } from "../../domain/services/subtitle-generation";
import { SubtitleService } from "../../domain/services/subtitle";

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
            provide: SubtitlesPublisher,
            useClass: KafkaSubtitlePublisher
        },
        SubtitleGenerationService,
        SubtitleService
    ],
    controllers: [KafkaVideoConsumer],
    exports: [KAFKA_CLIENT]
})
export class EventModule {}
