import { Column, Entity, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";
import {
    Subtitle,
    SubtitleId
} from "../../../domain/models/subtitles/Subtitle";
import { SubtitleLanguage } from "../../../domain/models/subtitles/SubtitleLanguage";
import { Video, VideoSlug } from "../../../domain/models/videos/Video";

@Entity("subtitle")
export class SubtitleEntity {
    @PrimaryGeneratedColumn("uuid")
    readonly subtitleId: string;

    @Column({
        type: "enum",
        enum: SubtitleLanguage,
        default: SubtitleLanguage.Fr
    })
    readonly language: SubtitleLanguage;

    @Column()
    readonly videoSlug: string;

    // TODO: Add persistent name column for subtitle vtt file path

    constructor(
        id: SubtitleId,
        language: SubtitleLanguage,
        videoSlug: VideoSlug
    ) {
        this.subtitleId = id;
        this.language = language;
        this.videoSlug = videoSlug;
    }

    static of(subtitle: Subtitle) {
        return new SubtitleEntity(
            subtitle.id,
            subtitle.language,
            subtitle.video.slug
        );
    }

    static into(entity: SubtitleEntity) {
        // TODO: Replace with mapped video
        const video = new Video(
            entity.videoSlug,
            entity.videoSlug,
            "undefined"
        );
        return new Subtitle(entity.subtitleId, video, entity.language);
    }
}
