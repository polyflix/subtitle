import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { gcloudConfig } from "../../../config/google.config";
import { Bucket, Storage } from "@google-cloud/storage";
import { StorageServiceUnreachable } from "../../domain/errors/StorageServiceUnreachable";
import { TextToSpeechProvider } from "../../domain/ports/TextToSpeechProvider";
import { Subtitle } from "../../domain/models/subtitles/Subtitle";
import { SpeechClient } from "@google-cloud/speech";
import * as path from "path";
import { google } from "@google-cloud/speech/build/protos/protos";
import ILongRunningRecognizeRequest = google.cloud.speech.v1.ILongRunningRecognizeRequest;
import IRecognitionConfig = google.cloud.speech.v1.IRecognitionConfig;
import AudioEncoding = google.cloud.speech.v1.RecognitionConfig.AudioEncoding;
import LongRunningRecognizeResponse = google.cloud.speech.v1.LongRunningRecognizeResponse;
import ILongRunningRecognizeResponse = google.cloud.speech.v1.ILongRunningRecognizeResponse;
import { SubtitleProcessingFailure } from "../../domain/errors/SubtitleProcessingFailure";
import { VttFile } from "@polyflix/vtt-parser";
import * as fs from "fs";

@Injectable()
export class GoogleCloudStoragePersistence extends TextToSpeechProvider {
    readonly #storageClient: Storage;
    readonly #speechClient: SpeechClient;
    readonly #bucket: Bucket;

    constructor(private readonly configService: ConfigService) {
        super();
        const config = gcloudConfig(this.configService);
        this.#storageClient = new Storage(config);
        this.#bucket = this.#storageClient.bucket(
            this.configService.get("storage.google.project.bucket")
        );
        this.#speechClient = new SpeechClient(config);
    }

    async #upload(filePath: string): Promise<void> {
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

    #getAudioGcpFilePath(audioPath: string): string {
        return `gs://${this.#bucket.name}/${path.basename(audioPath)}`;
    }

    #createTextToSpeechRequest(
        subtitle: Subtitle
    ): ILongRunningRecognizeRequest {
        const localAudioPath = subtitle.getLocalAudioFileName();
        const gcpAudioPath = this.#getAudioGcpFilePath(localAudioPath);
        const audio = {
            uri: gcpAudioPath
        };
        const config: IRecognitionConfig = {
            enableWordTimeOffsets: true,
            encoding: "MP3" as unknown as AudioEncoding,
            sampleRateHertz: 44100,
            languageCode: subtitle.language,
            alternativeLanguageCodes: ["en-US"],
            enableAutomaticPunctuation: true
        };
        return {
            audio: audio,
            config: config
        };
    }

    async #runRecognize(
        request: ILongRunningRecognizeRequest
    ): Promise<ILongRunningRecognizeResponse> {
        const [operation] = await this.#speechClient.longRunningRecognize(
            request
        );
        const [response] = await operation.promise();
        return response;
    }

    #tryRunRecognize(
        subtitle: Subtitle
    ): Promise<ILongRunningRecognizeResponse> {
        const request: ILongRunningRecognizeRequest =
            this.#createTextToSpeechRequest(subtitle);
        try {
            return this.#runRecognize(request);
        } catch (e) {
            this.logger.error("Failed to run speech to text", { error: e });
            throw new SubtitleProcessingFailure(
                subtitle.video.slug,
                subtitle.language
            );
        }
    }

    cleanUp(subtitle: Subtitle): Promise<void> {
        return Promise.resolve(undefined);
    }

    async runSubtitleProcessing(subtitle: Subtitle) {
        const transcript = await this.#tryRunRecognize(subtitle);
        const vttFile = VttFile.fromGoogleAPI(transcript);

        try {
            fs.writeFileSync(subtitle.getPersistenceFileName(), vttFile);
        } catch (e) {
            console.log(e);
        }
    }
}
