import { Global, Module } from "@nestjs/common";
import { GoogleCloudStoragePersistence } from "./GoogleCloudPersistence";
import { MinioModule } from "@svtslv/nestjs-minio";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { configureMinio } from "../../../config/minio.config";
import { MinioStoragePersistence } from "./MinioPersistence";
import { VTTStorageProvider } from "../../domain/ports/VTTStorageProvider";
import { TextToSpeechProvider } from "../../domain/ports/TextToSpeechProvider";

@Global()
@Module({
    imports: [
        MinioModule.forRootAsync({
            inject: [ConfigService],
            imports: [ConfigModule],
            useFactory: configureMinio
        })
    ],
    providers: [
        {
            provide: VTTStorageProvider,
            useClass: MinioStoragePersistence
        },
        {
            provide: TextToSpeechProvider,
            useClass: GoogleCloudStoragePersistence
        }
    ],
    exports: [VTTStorageProvider, TextToSpeechProvider]
})
export class StorageModule {}
