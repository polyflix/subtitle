import { Module } from "@nestjs/common";
import { SubtitleService } from "./subtitle";

@Module({
    exports: [SubtitleService],
    providers: [SubtitleService]
})
export class DomainServicesModule {}
