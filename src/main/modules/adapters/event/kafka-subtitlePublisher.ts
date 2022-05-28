import { Subtitle } from "../../domain/models/subtitles/Subtitle";
import { InjectKafkaClient } from "@polyflix/x-utils";
import { ClientKafka } from "@nestjs/microservices";
import { _SubtitlePublisher } from "../../domain/ports/_SubtitlePublisher";

export class KafkaSubtitlePublisher extends _SubtitlePublisher {
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
