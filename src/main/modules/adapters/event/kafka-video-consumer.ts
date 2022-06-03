import {
    InjectKafkaClient,
    PolyflixKafkaMessage,
    PolyflixKafkaValue
} from "@polyflix/x-utils";
import { ClientKafka, EventPattern, Payload } from "@nestjs/microservices";
import { ConfigService } from "@nestjs/config";
import { Controller, Logger } from "@nestjs/common";
import { VideoMessage } from "../../application/messages/video-message";
import { VideoMessageValidationPipe } from "../../application/pipes/VideoMessageValidationPipe";
import { SubtitleDto } from "../api/models/SubtitleDto";
import { SubtitleLanguage } from "../../domain/models/subtitles/SubtitleLanguage";
import { VideoState } from "../../application/messages/video-state";
import { SubtitleGenerationService } from "../../domain/services/subtitle-generation";

@Controller()
export class KafkaVideoConsumer {
    private static VIDEO_TOPIC_CONSUMER = "polyflix.video";

    private readonly logger = new Logger(this.constructor.name);

    constructor(
        @InjectKafkaClient() private readonly kafkaClient: ClientKafka,
        private readonly configService: ConfigService,
        private readonly subtitleGenerationService: SubtitleGenerationService
    ) {
        if (!this.configService.get("kafka.topics.subtitle")) {
            throw new Error(
                "Config key kafka.topics.subtitle was not configured, exiting"
            );
        }
    }

    @EventPattern(KafkaVideoConsumer.VIDEO_TOPIC_CONSUMER)
    publishSubtitleCreation(@Payload("value") value: PolyflixKafkaValue) {
        this.logger.debug("Sending publishSubtitleCreation");
        const subtitleDto = new SubtitleDto(
            value.payload.slug,
            value.payload.language ?? SubtitleLanguage.Fr
        );

        if (
            value.trigger === "CREATE" &&
            value.payload.sourceType === "internal"
        ) {
            this.subtitleGenerationService.generateVideoSubtitles(subtitleDto);
        }
    }
}
