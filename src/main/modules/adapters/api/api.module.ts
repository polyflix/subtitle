import { Module } from "@nestjs/common";
import { AccessSubtitleController } from "./access-subtitle.controller";
import { SubtitleService } from "../../domain/services/subtitle";
import { SubtitleGenerationService } from "../../domain/services/subtitle-generation";
import { AdminSubtitleController } from "./admin-subtitle.controller";
import { APP_GUARD } from "@nestjs/core";
import { RolesGuard } from "@polyflix/x-utils";

@Module({
    controllers: [AccessSubtitleController, AdminSubtitleController],
    providers: [
        SubtitleService,
        SubtitleGenerationService,
        {
            provide: APP_GUARD,
            useClass: RolesGuard
        }
    ]
})
export class ApiModule {}
