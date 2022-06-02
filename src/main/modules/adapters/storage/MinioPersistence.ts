import {
    Injectable,
    InternalServerErrorException,
    NotFoundException
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { StorageServiceUnreachable } from "../../domain/errors/StorageServiceUnreachable";
import { InjectMinioClient, MinioClient } from "@svtslv/nestjs-minio";
import { Readable } from "stream";
import * as Buffer from "buffer";
import { VTTFile } from "../../domain/models/VTTFile";
import { VTTStorageProvider } from "../../domain/ports/VTTStorageProvider";
import { Subtitle } from "../../domain/models/subtitles/Subtitle";
import * as fs from "fs";
import { Bucket } from "@google-cloud/storage";
import { CannotFindVideoFile } from "../../domain/errors/CannotFindVideoFile";

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
            await this.client.putObject(bucket, dest, file);
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

    async uploadVTT(subtitle: Subtitle): Promise<void> {
        try {
            const dest = subtitle.getVttFileName();
            const content = fs.readFileSync(subtitle.getLocalVttFileLocation());
            return this.#upload(MinIOBuckets.Subtitle, dest, content);
        } catch (e) {
            this.logger.error("Could not upload VTT file", { error: e });
        }
    }

    vttExists(subtitle: Subtitle): Promise<boolean> {
        return this.#fileExists(
            MinIOBuckets.Subtitle,
            subtitle.getVttFileName()
        );
    }

    async getVttFile(subtitle: Subtitle): Promise<VTTFile> {
        if (!(await this.vttExists(subtitle))) {
            throw new NotFoundException(subtitle);
        }

        const url_psu = await this.#getFilePSU(
            MinIOBuckets.Subtitle,
            subtitle.getVttFileName()
        );
        return new VTTFile(
            subtitle.getVttFileName(),
            url_psu,
            subtitle.language
        );
    }

    async downloadLocalVideo(subtitle: Subtitle): Promise<void> {
        const path = subtitle.getLocalVideoFileLocation();
        const videoFilename = `${
            subtitle.videoSlug
        }/${subtitle.getLocalVideoFileName()}`;

        await this.client
            .fGetObject(MinIOBuckets.Video, videoFilename, path)
            .catch((err) => {
                if (err) {
                    this.logger.error(err);
                    throw new CannotFindVideoFile(videoFilename);
                }
            });
        this.logger.log(`Succesfully retrieve video ${videoFilename}`);
    }
}
