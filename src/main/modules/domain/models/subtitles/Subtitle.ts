import { VideoSlug } from "../videos/Video";
import { SubtitleLanguage } from "./SubtitleLanguage";
import { SubtitleStatus } from "./SubtitleStatus";
import * as path from "path";
import { v4 as uuidv4 } from "uuid";

export type SubtitleId = string;

export class Subtitle {
    private _status: SubtitleStatus = SubtitleStatus.WAITING_UPLOAD;

    constructor(
        readonly id: SubtitleId,
        readonly videoSlug: VideoSlug,
        readonly language: SubtitleLanguage,
        public vttUrl: string
    ) {}

    static generateId() {
        return uuidv4();
    }

    getLocalDirectoryName() {
        return `/tmp/${this.videoSlug}`;
    }

    getVttFileName() {
        return `${this.language}_${this.videoSlug}.vtt`;
    }

    getLocalAudioFileName() {
        return `source.mp3`;
    }

    getLocalVideoFileName() {
        return `source.mp4`;
    }

    getPersistantAudioFileLocation() {
        return path.join(this.videoSlug, this.getLocalAudioFileName());
    }

    getLocalAudioFileLocation() {
        return path.join(
            this.getLocalDirectoryName(),
            this.getLocalAudioFileName()
        );
    }

    getLocalVideoFileLocation() {
        return path.join(
            this.getLocalDirectoryName(),
            this.getLocalVideoFileName()
        );
    }

    getLocalVttFileLocation() {
        return path.join(this.getLocalDirectoryName(), this.getVttFileName());
    }

    getLoggingIdentifier() {
        return `${this.videoSlug} (${this.language})`;
    }

    get status(): SubtitleStatus {
        return this._status;
    }

    set status(value: SubtitleStatus) {
        if (
            this._status === SubtitleStatus.FAILED ||
            this._status === SubtitleStatus.COMPLETED
        ) {
            throw new Error("Cannot change status of a subtitle");
        }
        this._status = value;
    }
}
