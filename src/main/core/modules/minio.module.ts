import { Global, Module } from "@nestjs/common";
import { MinioModule } from "@svtslv/nestjs-minio";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { configureMinio } from "../../config/minio.config";

@Global()
@Module({
    imports: [
        MinioModule.forRootAsync({
            inject: [ConfigService],
            imports: [ConfigModule],
            useFactory: configureMinio
        })
    ]
})
export class MinioConfigModule {}
