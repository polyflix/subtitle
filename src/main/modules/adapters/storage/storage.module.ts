import { Global, Module } from "@nestjs/common";
import { GoogleCloudStoragePersistence } from "./GoogleCloudPersistence";
import { MinioModule } from "@svtslv/nestjs-minio";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { configureMinio } from "../../../config/minio.config";

@Global()
@Module({
    imports: [
        MinioModule.forRootAsync({
            inject: [ConfigService],
            imports: [ConfigModule],
            useFactory: configureMinio
        })
    ],
    providers: [GoogleCloudStoragePersistence],
    exports: [GoogleCloudStoragePersistence]
})
export class StorageModule {}
