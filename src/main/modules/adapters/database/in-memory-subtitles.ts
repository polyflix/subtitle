import { SubtitleRepository } from "../../domain/ports/SubtitleRepository";
import { Subtitle, SubtitleId } from "../../domain/models/subtitles/Subtitle";
import { Array, Option } from "@swan-io/boxed";
import { Video, VideoSlug } from "../../domain/models/videos/Video";
import { SubtitleLanguage } from "../../domain/models/subtitles/SubtitleLanguage";
import { SubtitleStatus } from "../../domain/models/subtitles/SubtitleStatus";

export class InMemorySubtitles extends SubtitleRepository {
    #subtitles: Subtitle[] = [];
    constructor() {
        super();

        const subtitle = new Subtitle(
            "testSubtitleId",
            "05acab31-491b-498d-a7f6-7408baa417e6",
            SubtitleLanguage.Fr,
            ""
        );
        this.saveSubtitle(subtitle);
    }

    private searchWithSubtitleId(subtitleId: SubtitleId): Option<Subtitle> {
        const predicate = (subtitle) => subtitle.id === subtitleId;
        return Array.getBy(this.#subtitles, predicate);
    }

    private searchManyWithVideoSlug(videoSlug: VideoSlug): Subtitle[] {
        const predicate = (subtitle: Subtitle) =>
            subtitle.videoSlug === videoSlug;
        return this.#subtitles.filter(predicate);
    }

    private searchIndexWithSubtitleId(subtitleId: SubtitleId): Option<number> {
        const predicate = (subtitle) => subtitle.id === subtitleId;
        return Array.getIndexBy(this.#subtitles, predicate);
    }

    private searchWithVideoId(
        videoSlug: VideoSlug,
        language: SubtitleLanguage
    ): Option<Subtitle> {
        const predicate = (subtitle: Subtitle) =>
            subtitle.videoSlug === videoSlug && subtitle.language === language;
        return Array.getBy(this.#subtitles, predicate);
    }

    getSubtitle(
        videoSlug: VideoSlug,
        language: SubtitleLanguage
    ): Promise<Option<Subtitle>> {
        return Promise.resolve(this.searchWithVideoId(videoSlug, language));
    }

    private addToSubtitle(subtitle: Subtitle) {
        this.#subtitles.push(subtitle);
        return subtitle;
    }

    private updateSubtitle(index: number, subtitle: Subtitle) {
        this.#subtitles[index] = subtitle;
        return subtitle;
    }

    saveSubtitle(subtitle: Subtitle): Promise<Subtitle> {
        const found_subtitle = this.searchIndexWithSubtitleId(subtitle.id);
        return Promise.resolve(
            found_subtitle.isNone()
                ? this.addToSubtitle(subtitle)
                : this.updateSubtitle(found_subtitle.value, subtitle)
        );
    }

    getVideoSubtitles(videoSlug: VideoSlug): Promise<Subtitle[]> {
        return Promise.resolve(this.searchManyWithVideoSlug(videoSlug));
    }
}
