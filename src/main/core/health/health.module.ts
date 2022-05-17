import { HttpModule } from "@nestjs/axios";
import { Module } from "@nestjs/common";
import { TerminusModule } from "@nestjs/terminus";
import { HealthController } from "./health.controller";
import { StorageHealthModule } from "../../modules/adapters/storage/health/storageHealth.module";

@Module({
    imports: [TerminusModule, HttpModule, StorageHealthModule],
    controllers: [HealthController]
})
export class HealthModule {}
