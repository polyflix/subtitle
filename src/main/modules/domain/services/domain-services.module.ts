import { Module } from "@nestjs/common";
import { SubtitleService } from "./subtitle";
import { SubtitleRepository } from "../ports/SubtitleRepository";

@Module({
    imports: [SubtitleService],
    exports: [SubtitleService]
})
export class DomainServicesModule {}
