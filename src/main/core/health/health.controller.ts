import { Controller, Get } from "@nestjs/common";
import {
    HealthCheck,
    HealthCheckService,
    TypeOrmHealthIndicator
} from "@nestjs/terminus";
import { ConfigService } from "@nestjs/config";
import { MinioHealthIndicator } from "./minio/minio.health";

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
            () => this.minio.isHealthy(["videos", "subtitles"])
        ]);
    }
}
