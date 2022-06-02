import { Injectable, Logger } from "@nestjs/common";
import { Subtitle } from "../models/subtitles/Subtitle";

@Injectable()
export abstract class TextToSpeechProvider {
    protected logger = new Logger(this.constructor.name);
    abstract runSubtitleProcessing(subtitle: Subtitle): Promise<any>;
    abstract cleanUp(subtitle: Subtitle): Promise<void>;
}
