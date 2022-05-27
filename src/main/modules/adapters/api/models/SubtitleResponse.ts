import {
    Subtitle,
    SubtitleId
} from "../../../domain/models/subtitles/Subtitle";
import { SubtitleLanguage } from "../../../domain/models/subtitles/SubtitleLanguage";

export class SubtitleResponse {
    readonly id: SubtitleId;
    readonly language: SubtitleLanguage;

    private constructor(subtitle: Subtitle) {
        this.id = subtitle.id;
        this.language = subtitle.language;
    }

    static of(subtitle: Subtitle): SubtitleResponse {
        return new SubtitleResponse(subtitle);
    }
}
