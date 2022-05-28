import { SubtitleRepository } from "../../../domain/ports/SubtitleRepository";
import { VideoSlug } from "../../../domain/models/videos/Video";
import { SubtitleLanguage } from "../../../domain/models/subtitles/SubtitleLanguage";
import { Subtitle } from "../../../domain/models/subtitles/Subtitle";
import { Option } from "@swan-io/boxed";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { SubtitleEntity } from "./SubtitleEntity.entity";

export class PsqlSubtitlesRepository extends SubtitleRepository {
    constructor(
        @InjectRepository(SubtitleEntity)
        private readonly repository: Repository<SubtitleEntity>
    ) {
        super();
    }
    getSubtitle(
        videoId: VideoSlug,
        language: SubtitleLanguage
    ): Promise<Option<Subtitle>> {
        return Promise.resolve(undefined);
    }

    getVideoSubtitles(videoSlug: VideoSlug): Promise<Subtitle[]> {
        return Promise.resolve([]);
    }

    saveSubtitle(subtitle: Subtitle): Promise<void> {
        return Promise.resolve(undefined);
    }
}
