import { ConfigService } from "@nestjs/config";
import { TypeOrmModuleOptions } from "@nestjs/typeorm";
import { ISLOCAL } from "./loader.config";
import { resolve } from "path";
import { writeFileSync } from "fs";

export const configureTypeORM = (
  configService: ConfigService
): TypeOrmModuleOptions => {
  const url = configService.get<string>("database.psql.url");
  const credentialsConfig: any = {};
  if (url && url.length > 0) {
    credentialsConfig.url = url;
  } else {
    credentialsConfig.host = configService.get("database.psql.host");
    credentialsConfig.port = configService.get("database.psql.port");
    credentialsConfig.username = configService.get("database.psql.username");
    credentialsConfig.password = configService.get("database.psql.password");
    credentialsConfig.database = configService.get("database.psql.database");
  }

  const config: TypeOrmModuleOptions = {
    type: "postgres",
    synchronize: ISLOCAL,
    migrationsTableName: "migrations",
    entities: ["dist/**/*.entity.js"],
    logging: configService.get("database.psql.debug") === "true",
    cli: {
      migrationsDir: "src/resources/migrations"
    },
    autoLoadEntities: true,
    ...credentialsConfig
  };

  // Write TypeORM json config
  const path = resolve("ormconfig.json");
  writeFileSync(
    path,
    JSON.stringify({
      ...config,
      entities: ["src/**/*.entity.ts"],
      migrations: ["src/resources/migrations/*.ts"]
    })
  );

  return config;
};
