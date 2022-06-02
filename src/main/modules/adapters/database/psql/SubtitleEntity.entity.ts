import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import {
    Subtitle,
    SubtitleId
} from "../../../domain/models/subtitles/Subtitle";
import { SubtitleLanguage } from "../../../domain/models/subtitles/SubtitleLanguage";
import { Video, VideoSlug } from "../../../domain/models/videos/Video";
import { SubtitleStatus } from "../../../domain/models/subtitles/SubtitleStatus";

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

    @Column({
        type: "enum",
        enum: SubtitleStatus,
        default: SubtitleStatus.PROCESSING
    })
    status: SubtitleStatus;

    @Column({ nullable: true })
    vttUrl: string;

    // TODO: Add persistent name column for subtitle vtt file path

    constructor(
        id: SubtitleId,
        language: SubtitleLanguage,
        videoSlug: VideoSlug,
        status: SubtitleStatus,
        vttUrl: string = null
    ) {
        this.subtitleId = id;
        this.language = language;
        this.videoSlug = videoSlug;
        this.status = status;
        this.vttUrl = vttUrl;
    }

    static of(subtitle: Subtitle) {
        return new SubtitleEntity(
            subtitle.id,
            subtitle.language,
            subtitle.videoSlug,
            subtitle.status,
            subtitle.vttUrl
        );
    }

    static into(entity: SubtitleEntity) {
        const subtitle = new Subtitle(
            entity.subtitleId,
            entity.videoSlug,
            entity.language,
            entity.vttUrl
        );
        subtitle.status = entity.status;
        return subtitle;
    }
}
