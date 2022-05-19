import { Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Result } from "@swan-io/boxed";
import { gcloudConfig } from "../../../config/google.config";
import { Bucket, Storage } from "@google-cloud/storage";
import { StorageServiceUnreachable } from "../../domain/errors/StorageServiceUnreachable";
import { InjectMinioClient, MinioClient } from "@svtslv/nestjs-minio";
import { Readable, Stream } from "stream";
import { ReadableStream } from "stream/web";
import * as Buffer from "buffer";
import { VTTFile } from "../../domain/models/VTTFile";
import { VTTStorageProvider } from "../../domain/ports/VTTStorageProvider";

export enum MinIOBuckets {
    Video = "videos",
    Subtitle = "subtitles",
    Thumbnail = "images"
}

type StorageFileFormat = Readable | Buffer | string;

@Injectable()
export class MinioStoragePersistence extends VTTStorageProvider {
    constructor(
        @InjectMinioClient() private readonly client: MinioClient,
        private readonly configService: ConfigService
    ) {
        super();
    }

    async #upload(
        bucket: MinIOBuckets,
        dest: string,
        file: StorageFileFormat
    ): Promise<void> {
        this.logger.debug(
            "Uploading video, bucket: " +
                MinIOBuckets +
                ", destination: " +
                dest
        );
        try {
            await this.client.putObject(MinIOBuckets.Video, dest, file);
            return;
        } catch (e) {
            this.logger.error(
                "Could not upload file to MinIO, dest: " +
                    dest +
                    ", reason: " +
                    e,
                { error: e }
            );
            throw new StorageServiceUnreachable(e);
        }
    }

    async uploadVTT(file: VTTFile): Promise<void> {
        const dest = "vtt file name + path ... whatever";
        const content = "download the content";
        return this.#upload(MinIOBuckets.Video, dest, content);
    }
}
