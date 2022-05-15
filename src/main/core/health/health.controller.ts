import { Controller, Get } from "@nestjs/common";
import {
  HealthCheck,
  HealthCheckService,
  TypeOrmHealthIndicator
} from "@nestjs/terminus";
import { ConfigService } from "@nestjs/config";

/**
 * Export service readiness/liveness
 * More info: https://docs.nestjs.com/recipes/terminus
 */
@Controller("health")
export class HealthController {
    #databaseName = "subtitle"
  constructor(
    private health: HealthCheckService,
    private db: TypeOrmHealthIndicator,
    private configService: ConfigService
  ) {
      const dbName: string = this.configService.get<string>(
          "database.psql.database"
      );

      if (dbName && dbName !== "") {
          this.#databaseName = dbName
      }



  }

  @Get()
  @HealthCheck()
  check() {

      return this.health.check([() => this.db.pingCheck(this.#databaseName)]);
  }
}
