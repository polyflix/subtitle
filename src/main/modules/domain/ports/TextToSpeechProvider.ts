import { Injectable, Logger } from "@nestjs/common";
import { Subtitle } from "../models/subtitles/Subtitle";

@Injectable()
export abstract class TextToSpeechProvider {
    abstract runSubtitleProcessing(subtitle: Subtitle): Promise<any>;
    abstract uploadAudioFile(subtitle: Subtitle): Promise<any>;
    abstract cleanUp(subtitle: Subtitle): Promise<void>;
}
