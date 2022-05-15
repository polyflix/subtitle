import { Global, Module } from "@nestjs/common";
import { MinioConfigModule } from "../../modules/minio.module";
import { MinioHealthIndicator } from "./minio.health";

@Global()
@Module({
    imports: [MinioConfigModule],
    providers: [MinioHealthIndicator],
    exports: [MinioHealthIndicator]
})
export class MinioHealthModule {}
