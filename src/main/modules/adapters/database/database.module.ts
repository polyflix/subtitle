import { Global, Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { configureTypeORM } from "../../../config/database.config";
import { InMemorySubtitles } from "./in-memory-subtitles";
import { SubtitleRepository } from "../../domain/ports/SubtitleRepository";

@Global()
@Module({
    imports: [
        TypeOrmModule.forRootAsync({
            inject: [ConfigService],
            imports: [ConfigModule],
            useFactory: configureTypeORM
        })
    ],
    providers: [{ useClass: InMemorySubtitles, provide: SubtitleRepository }],
    exports: [SubtitleRepository]
})
export class DatabaseModule {}
