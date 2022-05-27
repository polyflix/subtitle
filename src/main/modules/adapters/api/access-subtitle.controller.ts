import { Controller, Get, Param } from "@nestjs/common";
import { Subtitle } from "../../domain/models/subtitles/Subtitle";
import { VideoSlug } from "../../domain/models/videos/Video";
import { SubtitleLanguage } from "../../domain/models/subtitles/SubtitleLanguage";
import { SubtitleService } from "../../domain/services/subtitle";
import { GetSubtitleAccessDTO } from "../../application/dto/getSubtitleAccess";
import { VTTFile } from "../../domain/models/VTTFile";

@Controller("")
export class AccessSubtitleController {
    constructor(private readonly svc: SubtitleService) {}
    @Get(":videoSlug/:language")
    async accessSubtitles(
        @Param("videoSlug") videoSlug: VideoSlug,
        @Param("language") language: SubtitleLanguage
    ): Promise<VTTFile> {
        const accessDto: GetSubtitleAccessDTO = {
            videoSlug,
            language
        };

        return this.svc.getVTTFile(accessDto);
    }
}
