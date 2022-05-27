import { Subtitle } from "../models/subtitles/Subtitle";
import { Option } from "@swan-io/boxed";
import { VideoSlug } from "../models/videos/Video";
import { SubtitleLanguage } from "../models/subtitles/SubtitleLanguage";
import { Injectable } from "@nestjs/common";

@Injectable()
export abstract class SubtitleRepository {
    abstract getSubtitle(
        videoId: VideoSlug,
        language: SubtitleLanguage
    ): Promise<Option<Subtitle>>;
    abstract saveSubtitle(subtitle: Subtitle): Promise<void>;
}
