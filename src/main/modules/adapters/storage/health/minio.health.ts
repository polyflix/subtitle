import { Injectable, Logger } from "@nestjs/common";
import {
    HealthCheckError,
    HealthIndicator,
    HealthIndicatorResult
} from "@nestjs/terminus";
import { InjectMinioClient, MinioClient } from "@svtslv/nestjs-minio";
import { mergeScan } from "rxjs";

@Injectable()
export class MinioHealthIndicator extends HealthIndicator {
    private readonly logger = new Logger(MinioHealthIndicator.name);
    private readonly key = "minio";

    constructor(@InjectMinioClient() private readonly client: MinioClient) {
        super();
    }

    async isHealthy(buckets?: string[]): Promise<HealthIndicatorResult> {
        const connectivityCheck = await this.canConnect();

        // We fail to connect
        if (connectivityCheck) {
            throw new HealthCheckError("Minio check failed", {
                message: connectivityCheck
            });
        }

        if (!buckets) {
            return this.getStatus(this.key, true);
        }

        for (let i = 0; i < buckets.length; i++) {
            const e = buckets[i];

            // Check whether the bucket exists or not
            const exists = await this.client.bucketExists(e);

            if (!exists) {
                throw new HealthCheckError("Minio check failed", {
                    message: "Bucket " + e + " does not exist on minio server"
                });
            }
        }
        return this.getStatus(this.key, true);
    }

    async canConnect(): Promise<string> {
        try {
            await this.client.listBuckets();
            return null;
        } catch (e) {
            this.logger.error("Could not connect to MinIO, reason: ", e);
            return e;
        }
    }
}
