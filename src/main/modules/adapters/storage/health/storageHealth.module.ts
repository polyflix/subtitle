import { Global, Module } from "@nestjs/common";
import { MinioHealthIndicator } from "./minio.health";
import { StorageModule } from "../storage.module";
import { GCloudHealthIndicator } from "./gcloud.health";

@Global()
@Module({
    imports: [StorageModule],
    providers: [MinioHealthIndicator, GCloudHealthIndicator],
    exports: [MinioHealthIndicator, GCloudHealthIndicator]
})
export class StorageHealthModule {}
