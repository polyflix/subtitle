import { Module } from "@nestjs/common";
import { AccessSubtitleController } from "./access-subtitle.controller";
import { SubtitleService } from "../../domain/services/subtitle";

@Module({
    controllers: [AccessSubtitleController],
    imports: [],
    providers: [SubtitleService]
})
export class ApiModule {}
