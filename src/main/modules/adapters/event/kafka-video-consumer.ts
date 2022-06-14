import {
    InjectKafkaClient,
    MinIOMessageValue,
    PolyflixKafkaValue,
    TriggerType
} from "@polyflix/x-utils";
import { ClientKafka, EventPattern, Payload } from "@nestjs/microservices";
import { ConfigService } from "@nestjs/config";
import { Controller, Logger } from "@nestjs/common";
import { SubtitleDto } from "../api/models/SubtitleDto";
import { SubtitleLanguage } from "../../domain/models/subtitles/SubtitleLanguage";
import { SubtitleGenerationService } from "../../domain/services/subtitle-generation";
import { MinIOBuckets } from "../storage/MinioPersistence";
import { SubtitleService } from "../../domain/services/subtitle";

@Controller()
export class KafkaVideoConsumer {
    private static VIDEO_TOPIC_CONSUMER = "polyflix.video";
    private static MINIO_VIDEO_TOPIC_CONSUMER = "polyflix.minio.video";

    private readonly logger = new Logger(this.constructor.name);

    constructor(
        @InjectKafkaClient() private readonly kafkaClient: ClientKafka,
        private readonly configService: ConfigService,
        private readonly subtitleService: SubtitleService,
        private readonly subtitleGenerationService: SubtitleGenerationService
    ) {
        if (!this.configService.get("kafka.topics.subtitle")) {
            throw new Error(
                "Config key kafka.topics.subtitle was not configured, exiting"
            );
        }

        if (!this.configService.get("kafka.topics.minio.video")) {
            throw new Error(
                "Config key kafka.topics.minio.video was not configured, exiting"
            );
        }
    }

    private extractAndValidateSlugFromMinIO(message: MinIOMessageValue) {
        const objectPath = message.Key;
        const composedPath = objectPath.split("/");

        if (composedPath.length !== 3) {
            this.logger.warn(
                `Did not expect the file to be encapsulated in more than one directory, is it a video file ? got: ${objectPath}`
            );
            return;
        }

        const bucket = composedPath[0];
        const videoSlug = composedPath[1];

        if (bucket !== MinIOBuckets.Video) {
            this.logger.error(
                `Received a message not related to video bucket, unexpected, path: ${objectPath}`
            );
            return;
        }

        return videoSlug;
    }

    @EventPattern(KafkaVideoConsumer.MINIO_VIDEO_TOPIC_CONSUMER)
    async triggerSubtitleGeneration(
        @Payload("value") message: MinIOMessageValue
    ) {
        const videoSlug = this.extractAndValidateSlugFromMinIO(message);

        if (!videoSlug) {
            this.logger.error(
                `Invalid slug, could not process message from minio`
            );
            return;
        }
        const subtitles = await this.subtitleService.getVideoSubtitles(
            videoSlug
        );

        if (subtitles.length === 0) {
            this.logger.warn(
                `Could not process video ${videoSlug} for subtitles, as there isn't any subtitles requested`
            );
            return;
        }

        // With an await on this method, we ensure the graceful shutdown can
        // be done by waiting this method to finish
        await this.subtitleGenerationService.tryGenerateVideoSubtitles(
            subtitles
        );
    }

    @EventPattern(KafkaVideoConsumer.VIDEO_TOPIC_CONSUMER)
    async registerSubtitleCreation(@Payload("value") value: PolyflixKafkaValue) {
        const subtitleDto = new SubtitleDto(
            value.payload.slug,
            value.payload.language ?? SubtitleLanguage.Fr
        );

        this.logger.log(
            `Received request to register video subtitle creation for ${subtitleDto.loggingIdentifier()}`
        );
        if (value.trigger !== TriggerType.CREATE) {
            this.logger.log(
                `Ignoring video creation event as it's not a create ${subtitleDto.loggingIdentifier()}`
            );
            return;
        }

        if (value.payload.sourceType !== "internal") {
            this.logger.log(
                `Ignoring video creation event as it's not an internal video: ${subtitleDto.loggingIdentifier()}`
            );
            return;
        }

        try {
            await this.subtitleGenerationService.registerSubtitleGenerationRequest(
                subtitleDto
            );
        } catch (e) {
            this.logger.error(
                `Could not process received message for video ${subtitleDto.loggingIdentifier()}`
            );
        }
    }
}
