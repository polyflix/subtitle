import { Video } from "../videos/Video";
import { SubtitleLanguage } from "./SubtitleLanguage";

export type SubtitleId = string;

export class Subtitle {
    constructor(
        readonly id: SubtitleId,
        readonly video: Video,
        readonly language: SubtitleLanguage
    ) {}

    getPersistenceFileName() {
        return `${this.language}_${this.video.slug}.vtt`;
    }
}
