import { SubtitleLanguage } from "../../../domain/models/subtitles/SubtitleLanguage";
import { VideoSlug } from "../../../domain/models/videos/Video";
import { Subtitle } from "../../../domain/models/subtitles/Subtitle";

export class SubtitleDto {
    readonly videoSlug: VideoSlug;
    readonly language: SubtitleLanguage;

    static into(dto: SubtitleDto): Subtitle {
        return new Subtitle(
            Subtitle.generateId(),
            dto.videoSlug,
            dto.language,
            null
        );
    }
}
