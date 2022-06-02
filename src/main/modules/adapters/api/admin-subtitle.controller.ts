import { Body, Controller, Post, UseFilters } from "@nestjs/common";
import { SubtitleService } from "../../domain/services/subtitle";
import { DomainExceptionFilter } from "./domain-exception.filter";
import { SubtitleDto } from "./models/SubtitleDto";
import { SubtitleGenerationService } from "../../domain/services/subtitle-generation";
import { Roles } from "@polyflix/x-utils";

@Controller("/subtitles")
@UseFilters(DomainExceptionFilter)
@Roles(Roles.ADMIN)
export class AdminSubtitleController {
    constructor(
        private readonly svc: SubtitleService,
        private readonly subtitleGenerationService: SubtitleGenerationService
    ) {}

    @Post()
    async generateSubtitles(@Body() createDto: SubtitleDto) {
        await this.subtitleGenerationService.generateVideoSubtitles(createDto);
    }
}
