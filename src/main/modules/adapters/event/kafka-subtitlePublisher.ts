import { Subtitle } from "../../domain/models/subtitles/Subtitle";
import { InjectKafkaClient } from "@polyflix/x-utils";
import { ClientKafka } from "@nestjs/microservices";
import { SubtitlePublisher } from "../../domain/ports/SubtitlePublisher";

export class KafkaSubtitlePublisher extends SubtitlePublisher {
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
