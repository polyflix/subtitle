import { Subtitle } from "../../../domain/models/subtitles/Subtitle";
import { SubtitleResponse } from "./SubtitleResponse";
import { VideoSlug } from "../../../domain/models/videos/Video";
import { Logger, UnprocessableEntityException } from "@nestjs/common";

export class GetManySubtitleResponse {
    static readonly #logger = new Logger(this.constructor.name);

    readonly subtitles;
    readonly videoSlug: VideoSlug;

    private constructor(videoSlug: VideoSlug, subtitleModels: Subtitle[]) {
        this.subtitles = this.mapSubtitles(subtitleModels);
        this.videoSlug = videoSlug;
    }

    /**
     * Takes raw subtitle and map them into the format of subtitles intended for
     * apis
     * @param subtitleModels
     */
    private mapSubtitles(subtitleModels: Subtitle[]) {
        const mapper = (subtitle: Subtitle) => SubtitleResponse.of(subtitle);
        return subtitleModels.map(mapper);
    }

    private static validateOnlyOneVideoSlug(subtitle: Subtitle[]) {
        if (subtitle.length === 0) return;
        const firstVideoSlug = subtitle[0].video.slug;

        // We test whether there is another video slug than the one expected
        const predicate = (subtitle: Subtitle) =>
            subtitle.video.slug !== firstVideoSlug;

        if (subtitle.filter(predicate).length > 0) {
            GetManySubtitleResponse.#logger.error(
                "Could not build adapter api model based on data, multiple video slug in array"
            );
            throw new UnprocessableEntityException(
                "Could not build your data, please try again late.r.."
            );
        }
    }

    static of(subtitles: Subtitle[]) {
        GetManySubtitleResponse.validateOnlyOneVideoSlug(subtitles);

        let firstVideoSlug = "";
        if (subtitles.length > 0) {
            firstVideoSlug = subtitles[0].video.slug;
        }
        return new GetManySubtitleResponse(firstVideoSlug, subtitles);
    }
}
