import { Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { gcloudConfig } from "../../../config/google.config";
import { Bucket, Storage, UploadOptions } from "@google-cloud/storage";
import { StorageServiceUnreachable } from "../../domain/errors/StorageServiceUnreachable";
import { TextToSpeechProvider } from "../../domain/ports/TextToSpeechProvider";
import { Subtitle } from "../../domain/models/subtitles/Subtitle";
import { SpeechClient } from "@google-cloud/speech";
import * as path from "path";
import { google } from "@google-cloud/speech/build/protos/protos";
import { SubtitleProcessingFailure } from "../../domain/errors/SubtitleProcessingFailure";
import { VttFile } from "@polyflix/vtt-parser";
import * as fs from "fs";
import { Span } from "nestjs-otel";
import ILongRunningRecognizeRequest = google.cloud.speech.v1.ILongRunningRecognizeRequest;
import IRecognitionConfig = google.cloud.speech.v1.IRecognitionConfig;
import AudioEncoding = google.cloud.speech.v1.RecognitionConfig.AudioEncoding;
import ILongRunningRecognizeResponse = google.cloud.speech.v1.ILongRunningRecognizeResponse;

@Injectable()
export class GoogleCloudStoragePersistence extends TextToSpeechProvider {
    readonly #storageClient: Storage;
    readonly #speechClient: SpeechClient;
    readonly #bucket: Bucket;

    protected logger = new Logger(GoogleCloudStoragePersistence.name);
    constructor(private readonly configService: ConfigService) {
        super();
        const config = gcloudConfig(this.configService);
        this.#storageClient = new Storage(config);
        this.#bucket = this.#storageClient.bucket(
            this.configService.get("storage.google.project.bucket")
        );
        this.#speechClient = new SpeechClient(config);
    }

    async #upload(
        filePath: string,
        uploadOption?: UploadOptions
    ): Promise<void> {
        this.logger.debug(`Uploading file to GCP ${filePath}`);
        try {
            await this.#bucket.upload(filePath, uploadOption);
            return;
        } catch (e) {
            this.logger.error("Failed to upload file to GCP, reason: " + e, {
                error: e
            });
            throw new StorageServiceUnreachable(e);
        }
    }

    #getAudioGcpFilePath(audioPath: string): string {
        return `gs://${this.#bucket.name}/${audioPath}`;
    }

    #createTextToSpeechRequest(
        subtitle: Subtitle
    ): ILongRunningRecognizeRequest {
        const persistantAudioPath = subtitle.getPersistantAudioFileLocation();
        const gcpAudioPath = this.#getAudioGcpFilePath(persistantAudioPath);
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
        this.logger.debug(
            `tryRunRecognize() ${subtitle.getLoggingIdentifier()}`
        );
        const request: ILongRunningRecognizeRequest =
            this.#createTextToSpeechRequest(subtitle);
        try {
            return this.#runRecognize(request);
        } catch (e) {
            this.logger.error("Failed to run speech to text", { error: e });
            throw new SubtitleProcessingFailure(
                subtitle.videoSlug,
                subtitle.language
            );
        }
    }

    #saveVttLocal(subtitle: Subtitle, vttFileContent: string) {
        try {
            this.logger.debug(
                `saveVttLocal() ${subtitle.getLoggingIdentifier()}`
            );
            const vttFilePath = subtitle.getLocalVttFileLocation();

            if (!fs.existsSync(path.dirname(vttFilePath))) {
                fs.mkdirSync(path.dirname(vttFilePath), { recursive: true });
            }
            fs.writeFileSync(vttFilePath, vttFileContent);
        } catch (e) {
            this.logger.error("Fail to write vtt file", { error: e });
            throw new SubtitleProcessingFailure(
                subtitle.videoSlug,
                subtitle.language
            );
        }
    }

    @Span()
    async cleanUp(subtitle: Subtitle): Promise<void> {
        this.logger.debug(`cleanUp() ${subtitle.getLoggingIdentifier()}`);
        try {
            const gcpAudioPath = subtitle.getPersistantAudioFileLocation();
            await this.#bucket.file(gcpAudioPath).delete();
        } catch (e) {
            this.logger.error("Failed to clean up audio file", { error: e });
        }
    }

    @Span()
    async runSubtitleProcessing(subtitle: Subtitle) {
        const transcript = await this.#tryRunRecognize(subtitle);
        const vttFile = VttFile.fromGoogleAPI(transcript);

        this.#saveVttLocal(subtitle, vttFile);
    }

    @Span()
    async uploadAudioFile(subtitle: Subtitle): Promise<void> {
        this.logger.debug(
            `uploadAudioFile() ${subtitle.getLoggingIdentifier()}`
        );

        const audioPath = subtitle.getLocalAudioFileLocation();
        const uploadOption: UploadOptions = {
            destination: subtitle.getPersistantAudioFileLocation(),
            resumable: false
        };
        await this.#upload(audioPath, uploadOption);
    }
}
