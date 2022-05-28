import { Global, Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { SubtitleEntity } from "./psql/SubtitleEntity.entity";
import { PsqlSubtitlesRepository } from "./psql/psql-subtitles";
import { SubtitleRepository } from "../../domain/ports/SubtitleRepository";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { configureTypeORM } from "../../../config/database.config";

@Global()
@Module({
    imports: [
        TypeOrmModule.forRootAsync({
            inject: [ConfigService],
            imports: [ConfigModule],
            useFactory: configureTypeORM
        }),
        TypeOrmModule.forFeature([SubtitleEntity])
    ],
    providers: [
        // { useClass: InMemorySubtitles, provide: SubtitleRepository }
        { useClass: PsqlSubtitlesRepository, provide: SubtitleRepository }
    ],
    exports: [SubtitleRepository]
})
export class DatabaseModule {}
