import { VTTFile } from "../models/VTTFile";
import { Injectable, Logger } from "@nestjs/common";
import { Subtitle } from "../models/subtitles/Subtitle";

@Injectable()
export abstract class VTTStorageProvider {
    protected logger = new Logger(this.constructor.name);

    abstract uploadVTT(subtitle: Subtitle): Promise<void>;
    abstract vttExists(subtitle: Subtitle): Promise<boolean>;
    abstract getVttFile(subtitle: Subtitle): Promise<VTTFile>;
    abstract downloadLocalVideo(subtitle: Subtitle): Promise<void>;
}
