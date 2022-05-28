import { Subtitle } from "../../domain/models/subtitles/Subtitle";
import { InjectKafkaClient } from "@polyflix/x-utils";
import { ClientKafka } from "@nestjs/microservices";
import { SubtitlesPublisher } from "../../domain/ports/SubtitlesPublisher";

export class KafkaSubtitlePublisher extends SubtitlesPublisher {
    constructor(@InjectKafkaClient() kafkaClient: ClientKafka) {
        super();
    }

    publishSubtitleCreation(subtitle: Subtitle) {
        this.logger.debug("Sending publishSubtitleCreation");
        this.logger.log(
            "KafkaSubtitlePublisher.publishSubtitleCreation is not implemented yet"
        );
    }
}
