import { HttpModule } from "@nestjs/axios";
import { Module } from "@nestjs/common";
import { TerminusModule } from "@nestjs/terminus";
import { HealthController } from "./health.controller";
import { MinioHealthModule } from "./minio/miniohealth.module";

@Module({
    imports: [TerminusModule, HttpModule, MinioHealthModule],
    controllers: [HealthController]
})
export class HealthModule {}
