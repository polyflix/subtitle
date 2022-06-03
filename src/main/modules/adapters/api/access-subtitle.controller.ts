import { Controller, Get, Param, UseFilters } from "@nestjs/common";
import { VideoSlug } from "../../domain/models/videos/Video";
import { SubtitleLanguage } from "../../domain/models/subtitles/SubtitleLanguage";
import { SubtitleService } from "../../domain/services/subtitle";
import { GetSubtitleAccessDTO } from "../../application/dto/getSubtitleAccess";
import { VTTFile } from "../../domain/models/VTTFile";
import { GetManySubtitleResponse } from "./models/GetManySubtitle.response";
import { DomainExceptionFilter } from "./domain-exception.filter";
import { Span } from "nestjs-otel";

@Controller("/subtitles")
@UseFilters(DomainExceptionFilter)
export class AccessSubtitleController {
    constructor(private readonly svc: SubtitleService) {}

    @Get(":videoSlug")
    @Span()
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
}
