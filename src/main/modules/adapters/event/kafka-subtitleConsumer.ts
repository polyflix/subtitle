import { InjectKafkaClient } from "@polyflix/x-utils";
import { ClientKafka, EventPattern, Payload } from "@nestjs/microservices";
import { ConfigService } from "@nestjs/config";
import { Controller, Logger } from "@nestjs/common";
import { VideoMessage } from "../../application/messages/video-message";
import { VideoMessageValidationPipe } from "../../application/pipes/VideoMessageValidationPipe";

@Controller()
export class KafkaSubtitleConsumer {
    private static VIDEO_TOPIC_CONSUMER = "polyflix.video";
    private static SUBTITLE_TOPIC_PRODUCER = "polyflix.subtitle";

    private readonly logger = new Logger(this.constructor.name);

    constructor(
        @InjectKafkaClient() private readonly kafkaClient: ClientKafka,
        private readonly configService: ConfigService
    ) {
        if (!this.configService.get("kafka.topics.subtitle")) {
            throw new Error(
                "Config key kafka.topics.subtitle was not configured, exiting"
            );
        }
        KafkaSubtitleConsumer.SUBTITLE_TOPIC_PRODUCER = this.configService.get(
            "kafka.topics.subtitle"
        );
    }

    @EventPattern(KafkaSubtitleConsumer.VIDEO_TOPIC_CONSUMER)
    newVideoEvent(
        @Payload("value", new VideoMessageValidationPipe())
        payload: VideoMessage
    ) {
        this.logger.log(JSON.stringify(payload));
    }
}
