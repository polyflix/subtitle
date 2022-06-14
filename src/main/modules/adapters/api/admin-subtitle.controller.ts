import { Body, Controller, Post, UseFilters } from "@nestjs/common";
import { SubtitleService } from "../../domain/services/subtitle";
import { DomainExceptionFilter } from "./domain-exception.filter";
import { SubtitleDto } from "./models/SubtitleDto";
import { SubtitleGenerationService } from "../../domain/services/subtitle-generation";
import { Roles, Role } from "@polyflix/x-utils";
import { Span } from "nestjs-otel";

@Controller("/admin/subtitles")
@UseFilters(DomainExceptionFilter)
@Roles(Role.Admin)
export class AdminSubtitleController {
    constructor(
        private readonly svc: SubtitleService,
        private readonly subtitleGenerationService: SubtitleGenerationService
    ) {}

    @Post()
    @Span()
    async generateSubtitles(@Body() createDto: SubtitleDto) {
        await this.subtitleGenerationService.registerSubtitleGenerationRequest(
            createDto
        );
        const subtitle = await this.svc.getSubtitle(createDto);
        this.subtitleGenerationService.tryGenerateVideoSubtitle(subtitle);
    }
}
