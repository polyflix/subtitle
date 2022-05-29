import { SubtitleRepository } from "../../../domain/ports/SubtitleRepository";
import { VideoSlug } from "../../../domain/models/videos/Video";
import { SubtitleLanguage } from "../../../domain/models/subtitles/SubtitleLanguage";
import { Subtitle } from "../../../domain/models/subtitles/Subtitle";
import { Option } from "@swan-io/boxed";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { SubtitleEntity } from "./SubtitleEntity.entity";
import { Logger, NotFoundException } from "@nestjs/common";

export class PsqlSubtitlesRepository extends SubtitleRepository {
    readonly #logger = new Logger(this.constructor.name);

    constructor(
        @InjectRepository(SubtitleEntity)
        private readonly repository: Repository<SubtitleEntity>
    ) {
        super();
    }

    /**
     * Finnd a subtitle based on videoSlug & language data
     * Throw if the subtitle is not found
     * @param videoSlug
     * @param language
     * @private
     */
    private async getSubtitleByVideo(
        videoSlug: VideoSlug,
        language: SubtitleLanguage
    ) {
        this.#logger.debug(
            `getSubtitleByVideo(), on arguments ${videoSlug}, ${language}`
        );
        const subtitle = await this.repository.findOne({
            videoSlug,
            language
        });

        if (!subtitle) {
            throw new NotFoundException({ videoSlug, language });
        }

        return subtitle;
    }

    /**
     * Find many subtitles that are related to a single video slug
     * @param videoSlug
     * @private
     */
    private async getSubtitlesByVideo(videoSlug: VideoSlug) {
        this.#logger.debug(
            `getSubtitlesByVideo(), on arguments (${videoSlug})`
        );
        const found_subtitles = await this.repository.find({
            videoSlug
        });

        return found_subtitles;
    }

    async getSubtitle(
        videoId: VideoSlug,
        language: SubtitleLanguage
    ): Promise<Option<Subtitle>> {
        try {
            // This method throw if no subtitle found
            const subtitle = await this.getSubtitleByVideo(videoId, language);
            return Option.Some(SubtitleEntity.into(subtitle));
        } catch (e) {
            if (e instanceof NotFoundException) {
                this.#logger.warn(
                    `Could not find subtitle for pair (${videoId}, ${language})`
                );
            } else {
                this.#logger.error(
                    `Unexpected error when fetching pair (${videoId}, ${language}): ${e}`
                );
            }
            return Option.None();
        }
    }

    async getVideoSubtitles(videoSlug: VideoSlug): Promise<Subtitle[]> {
        const found_subtitles = await this.getSubtitlesByVideo(videoSlug);
        return found_subtitles.map(SubtitleEntity.into);
    }

    saveSubtitle(subtitle: Subtitle): Promise<void> {
        return Promise.resolve(undefined);
    }
}
