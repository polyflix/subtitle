import { Injectable, Logger } from "@nestjs/common";
import {
    HealthCheckError,
    HealthIndicator,
    HealthIndicatorResult
} from "@nestjs/terminus";
import { ConfigService } from "@nestjs/config";
import { Storage } from "@google-cloud/storage";
import { gcloudConfig } from "../../../../config/google.config";

@Injectable()
export class GCloudHealthIndicator extends HealthIndicator {
    private readonly logger = new Logger(GCloudHealthIndicator.name);
    private readonly key = "gcloud";

    private readonly storage: Storage;
    private readonly bucket: string;

    constructor(private readonly cfg: ConfigService) {
        super();
        this.storage = new Storage(gcloudConfig(cfg));
        this.bucket = cfg.get("storage.google.project.bucket");
    }

    async isHealthy(): Promise<HealthIndicatorResult> {
        try {
            const [metadata] = await this.storage
                .bucket(this.bucket)
                .getMetadata();
            if (metadata.id === this.bucket) {
                return this.getStatus(this.key, true);
            }
        } catch (e) {
            this.logger.error(
                "Failed to healthcheck google bucket, reason: " + e
            );
            throw new HealthCheckError("GCloud check failed", e);
        }
    }
}
