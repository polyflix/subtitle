import { Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { gcloudConfig } from "../../../config/google.config";
import { Bucket, Storage } from "@google-cloud/storage";
import { StorageServiceUnreachable } from "../../domain/errors/StorageServiceUnreachable";
import { TextToSpeechProvider } from "../../domain/ports/TextToSpeechProvider";

@Injectable()
export class GoogleCloudStoragePersistence extends TextToSpeechProvider {
    readonly #client: Storage;
    readonly #bucket: Bucket;

    constructor(private readonly configService: ConfigService) {
        super();
        const config = gcloudConfig(this.configService);
        this.#client = new Storage(config);
        this.#bucket = this.#client.bucket(
            this.configService.get("storage.google.project.bucket")
        );
    }

    async upload(filePath: string): Promise<void> {
        this.logger.debug("Uploading file to GCP", { file: filePath });
        try {
            await this.#bucket.upload(filePath);
            return;
        } catch (e) {
            this.logger.error("Failed to upload file to GCP, reason: " + e, {
                error: e
            });
            throw new StorageServiceUnreachable(e);
        }
    }
}
