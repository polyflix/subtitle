import { DomainException } from "./DomainException";
import { VideoSlug } from "../models/videos/Video";
import { SubtitleLanguage } from "../models/subtitles/SubtitleLanguage";

export class SubtitleAlreadyExists extends DomainException {
    constructor(videoSlug: VideoSlug, language: SubtitleLanguage) {
        super(`${videoSlug} (${language})`);
    }
}
