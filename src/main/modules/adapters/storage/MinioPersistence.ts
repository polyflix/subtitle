import { Injectable, NotFoundException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { StorageServiceUnreachable } from "../../domain/errors/StorageServiceUnreachable";
import { InjectMinioClient, MinioClient } from "@svtslv/nestjs-minio";
import { Readable } from "stream";
import * as Buffer from "buffer";
import { VTTFile } from "../../domain/models/VTTFile";
import { VTTStorageProvider } from "../../domain/ports/VTTStorageProvider";
import { Subtitle } from "../../domain/models/subtitles/Subtitle";

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

    async #fileExists(bucket: MinIOBuckets, path: string): Promise<boolean> {
        try {
            // Statobject will throw an error if the file doesn't exist
            const result = await this.client.statObject(bucket, path);
            return !!result;
        } catch (e) {
            this.logger.warn(
                `Could not stat object ${path} in bucket ${bucket}`
            );
            return false;
        }
    }

    async #getFilePSU(bucket: MinIOBuckets, path: string): Promise<string> {
        try {
            const url = await this.client.presignedGetObject(bucket, path);
            return url;
        } catch (e) {
            this.logger.warn(`Could not find object ${path} in ${bucket}`);
            throw new NotFoundException(path);
        }
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

    vttExists(subtitle: Subtitle): Promise<boolean> {
        return this.#fileExists(
            MinIOBuckets.Subtitle,
            subtitle.getPersistenceFileName()
        );
    }

    async getVttFile(subtitle: Subtitle): Promise<VTTFile> {
        if (!(await this.vttExists(subtitle))) {
            throw new NotFoundException(subtitle);
        }

        const url_psu = await this.#getFilePSU(
            MinIOBuckets.Subtitle,
            subtitle.getPersistenceFileName()
        );
        return new VTTFile(
            subtitle.getPersistenceFileName(),
            url_psu,
            subtitle.language
        );
    }
}
