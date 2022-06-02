import { Body, Controller, Get, Param, Post, UseFilters } from "@nestjs/common";
import { VideoSlug } from "../../domain/models/videos/Video";
import { SubtitleLanguage } from "../../domain/models/subtitles/SubtitleLanguage";
import { SubtitleService } from "../../domain/services/subtitle";
import { GetSubtitleAccessDTO } from "../../application/dto/getSubtitleAccess";
import { VTTFile } from "../../domain/models/VTTFile";
import { GetManySubtitleResponse } from "./models/GetManySubtitle.response";
import { DomainExceptionFilter } from "./domain-exception.filter";
import { SubtitleDto } from "./models/SubtitleDto";
import { SubtitleGenerationService } from "../../domain/services/subtitle-generation";

@Controller("/subtitles")
@UseFilters(DomainExceptionFilter)
export class AccessSubtitleController {
    constructor(
        private readonly svc: SubtitleService,
        private readonly subtitleGenerationService: SubtitleGenerationService
    ) {}

    @Get(":videoSlug")
    async getVideoSubtitles(
        @Param("videoSlug") videoSlug: VideoSlug
    ): Promise<GetManySubtitleResponse> {
        const subtitles = await this.svc.getVideoSubtitles(videoSlug);
        return GetManySubtitleResponse.of(subtitles);
    }

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

    @Get()
    async tempGenerateSubtitles() {
        await this.subtitleGenerationService.generateVideoSubtitles({
            videoSlug: "9a45915f-25f0-4689-a4b9-bde9a858cc50",
            language: SubtitleLanguage.Fr
        });
    }
}
