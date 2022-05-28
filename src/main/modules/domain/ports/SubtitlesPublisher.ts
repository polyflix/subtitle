import { Subtitle } from "../models/subtitles/Subtitle";
import { Logger } from "@nestjs/common";

export abstract class SubtitlesPublisher {
    protected readonly logger = new Logger(this.constructor.name);
    abstract publishSubtitleCreation(subtitle: Subtitle);
}
