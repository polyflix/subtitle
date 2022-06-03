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
    private static SUBTITLE_TOPIC_PRODUCER = "polyflix.subtitle";

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
        KafkaVideoConsumer.SUBTITLE_TOPIC_PRODUCER = this.configService.get(
            "kafka.topics.subtitle"
        );
    }

    @EventPattern(KafkaVideoConsumer.VIDEO_TOPIC_CONSUMER)
    newVideoEvent(
        @Payload("value", new VideoMessageValidationPipe())
        payload: VideoMessage
    ) {
        this.logger.log(JSON.stringify(payload));
    }

    @EventPattern(KafkaVideoConsumer.SUBTITLE_TOPIC_PRODUCER)
    publishSubtitleCreation(@Payload("value") value: PolyflixKafkaValue) {
        this.logger.debug("Sending publishSubtitleCreation");
        const subtitleDto = new SubtitleDto(
            value.payload.slug,
            value.payload.language ?? SubtitleLanguage.Fr
        );

        if (value.trigger === "CREATE") {
            this.subtitleGenerationService.generateVideoSubtitles(subtitleDto);
        }
    }
}
