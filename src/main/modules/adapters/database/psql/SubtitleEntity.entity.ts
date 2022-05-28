import { Column, Entity, PrimaryColumn } from "typeorm";
import {
    Subtitle,
    SubtitleId
} from "../../../domain/models/subtitles/Subtitle";
import { SubtitleLanguage } from "../../../domain/models/subtitles/SubtitleLanguage";

@Entity("subtitle")
export class SubtitleEntity {
    @PrimaryColumn("uuid")
    readonly subtitleId: SubtitleId;

    @Column({
        type: "enum",
        enum: SubtitleLanguage,
        default: SubtitleLanguage.Fr
    })
    readonly language: SubtitleLanguage;

    // TODO: Add persistent name column for subtitle vtt file path

    constructor(id: SubtitleId, language: SubtitleLanguage) {
        this.subtitleId = id;
        this.language = language;
    }
    static of(subtitle: Subtitle) {
        return new SubtitleEntity(subtitle.id, subtitle.language);
    }
}
