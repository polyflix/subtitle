import { Subtitle } from "../models/subtitles/Subtitle";
import { Injectable, Logger } from "@nestjs/common";

@Injectable()
export abstract class SubtitlePublisher {
    protected readonly logger = new Logger(this.constructor.name);

    abstract publishSubtitleCreation(subtitle: Subtitle);
}
