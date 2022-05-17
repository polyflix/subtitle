import { Controller, Get } from "@nestjs/common";
import {
    HealthCheck,
    HealthCheckService,
    TypeOrmHealthIndicator
} from "@nestjs/terminus";
import { ConfigService } from "@nestjs/config";
import { MinioHealthIndicator } from "../../modules/adapters/storage/health/minio.health";
import { GCloudHealthIndicator } from "../../modules/adapters/storage/health/gcloud.health";

/**
 * Export service readiness/liveness
 * More info: https://docs.nestjs.com/recipes/terminus
 */
@Controller("health")
export class HealthController {
    #databaseName = "subtitle";
    constructor(
        private health: HealthCheckService,
        private db: TypeOrmHealthIndicator,
        private minio: MinioHealthIndicator,
        private gcloud: GCloudHealthIndicator,
        private configService: ConfigService
    ) {
        const dbName: string = this.configService.get<string>(
            "database.psql.database"
        );

        if (dbName && dbName !== "") {
            this.#databaseName = dbName;
        }
    }

    @Get()
    @HealthCheck()
    check() {
        return this.health.check([
            () => this.db.pingCheck(this.#databaseName),
            () => this.minio.isHealthy(["videos", "subtitles"]),
            () => this.gcloud.isHealthy()
        ]);
    }
}
