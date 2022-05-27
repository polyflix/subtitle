import { VideoSlug } from "../../domain/models/videos/Video";
import { SubtitleLanguage } from "../../domain/models/subtitles/SubtitleLanguage";
import { IsEnum, IsNotEmpty } from "class-validator";

export class GetSubtitleAccessDTO {
    @IsNotEmpty()
    videoSlug: VideoSlug;

    @IsEnum(SubtitleLanguage)
    language: SubtitleLanguage;
}
