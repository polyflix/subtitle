import { Injectable, Logger } from "@nestjs/common";
import { VTTStorageProvider } from "../ports/VTTStorageProvider";
import { SubtitleRepository } from "../ports/SubtitleRepository";
import { SubtitleService } from "./subtitle";
import { TextToSpeechProvider } from "../ports/TextToSpeechProvider";
import { Subtitle } from "../models/subtitles/Subtitle";
import * as ffmpegInstaller from "@ffmpeg-installer/ffmpeg";
import * as ffmpeg from "fluent-ffmpeg";
import { SubtitleDto } from "../../adapters/api/models/SubtitleDto";
import { SubtitleStatus } from "../models/subtitles/SubtitleStatus";
import * as fs from "fs";
import { SubtitleAlreadyExists } from "../errors/SubtitleAlreadyExists";

ffmpeg.setFfmpegPath(ffmpegInstaller.path);

@Injectable()
export class SubtitleGenerationService {
    private readonly logger = new Logger(SubtitleGenerationService.name);

    constructor(
        private readonly storageProvider: VTTStorageProvider,
        private readonly textToSpeechProvider: TextToSpeechProvider,
        private readonly subtitles: SubtitleRepository,
        private readonly subtitleService: SubtitleService
    ) {}

    private videoToAudio(subtitle: Subtitle) {
        const videoFilePath = subtitle.getLocalVideoFileLocation();
        const audioFilePath = subtitle.getLocalAudioFileLocation();

        return new Promise((resolve, reject) => {
            ffmpeg(videoFilePath)
                .noVideo()
                .toFormat("mp3")
                .on("start", (commandLine) => {
                    this.logger.debug(
                        `Spawned Ffmpeg with command: ${commandLine}`
                    );
                })
                .on("error", (err, stdout, stderr) => {
                    this.logger.error(err);
                    this.logger.error(stdout);
                    this.logger.error(stderr);
                    reject(err);
                })
                .on("end", (stdout, stderr) => {
                    this.logger.error(stdout);
                    this.logger.error(stderr);
                    this.logger.log("Audio convertion success");
                    resolve(audioFilePath);
                })
                .saveToFile(audioFilePath);
        });
    }

    /**
     * Remove any folder / file created for a generation
     * @private
     * @param subtitle
     */
    async #cleanUp(subtitle: Subtitle) {
        this.logger.debug(`cleanUp() ${subtitle.getLoggingIdentifier()}`);
        const directoryPath = subtitle.getLocalDirectoryName();
        fs.rmSync(directoryPath, { recursive: true, force: true });
        await this.textToSpeechProvider.cleanUp(subtitle);
    }

    async registerSubtitleGenerationRequest(
        subtitleDto: SubtitleDto
    ): Promise<void> {
        const { videoSlug, language } = subtitleDto;
        await this.subtitleService.validateSubtitleDoesNotExist(
            videoSlug,
            language
        );

        await this.subtitleService.createSubtitle(subtitleDto);
    }

    private async generateVideoSubtitles(subtitle: Subtitle) {
        await this.subtitleService.updateSubtitleStatus(
            subtitle,
            SubtitleStatus.PROCESSING
        );

        await this.storageProvider.downloadLocalVideo(subtitle);

        await this.videoToAudio(subtitle);

        await this.textToSpeechProvider.uploadAudioFile(subtitle);
        await this.textToSpeechProvider.runSubtitleProcessing(subtitle);
        await this.storageProvider.uploadVTT(subtitle);

        subtitle.vttUrl = subtitle.getVttFileName();
        subtitle.status = SubtitleStatus.COMPLETED;
        await this.subtitleService.updateSubtitle(subtitle);
    }

    async tryGenerateVideoSubtitle(subtitle: Subtitle) {
        try {
            await this.generateVideoSubtitles(subtitle);
        } catch (error) {
            await this.subtitleService.updateSubtitleStatus(
                subtitle,
                SubtitleStatus.FAILED
            );
            this.logger.error(error);
        } finally {
            await this.#cleanUp(subtitle);
        }
    }

    async tryGenerateVideoSubtitles(subtitles: Subtitle[]) {
        for (let i = 0; i < subtitles.length; i++) {
            const subtitle = subtitles[i];
            this.logger.log(
                `Running processing for ${subtitle.getLoggingIdentifier()}`
            );

            this.tryGenerateVideoSubtitle(subtitle)
                .then(() => {
                    this.logger.log(
                        `Subtitle processing for ${subtitle.getLoggingIdentifier()} is done`
                    );
                })
                .catch((err) => {
                    this.logger.error(
                        `Subtitlte processing for ${subtitle.getLoggingIdentifier()} failed, reason: ${err}`
                    );
                });
        }
    }
}
