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

    /**
     * Take an audio file and upload it to TextToSpeech service
     * @param TODO
     * @private
     */
    private uploadToSpeechToText(TODO: any) {
        this.logger.log(
            "SubtitleGenerationService.uploadToSpeechToText() to be implemented"
        );
    }

    /**
     * Ask TextToSpeech ports to run it
     * @private
     */
    private runSpeechToText() {
        this.logger.log(
            "SubtitleGenerationService.runSpeechToText() to be implemented"
        );
    }

    /**
     * Once the work is done for speech to text, we take it back
     * @param TODO
     * @private
     */
    private downloadFromSpeechToText(TODO: any) {
        this.logger.log(
            "SubtitleGenerationService.downloadFromSpeechToText() to be implemented"
        );
    }

    /**
     * We upload the VTT file definitely to persistent storage
     * @param TODO
     * @private
     */
    private uploadToPersistent(file: string) {
        this.logger.log(
            "SubtitleGenerationService.uploadToPersistent() to be implemented"
        );
    }

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
     * @param TODO
     * @private
     */
    async #cleanUp(subtitle: Subtitle) {
        this.logger.debug(`cleanUp() ${subtitle.getLoggingIdentifier()}`);
        const directoryPath = subtitle.getLocalDirectoryName();
        fs.rmSync(directoryPath, { recursive: true, force: true });
        await this.textToSpeechProvider.cleanUp(subtitle);
    }

    async generateVideoSubtitles(subtitleDto: SubtitleDto) {
        const { videoSlug, language } = subtitleDto;

        const subtitlesExists = await this.subtitleService.checkSubtitleExists(
            videoSlug,
            language
        );
        if (subtitlesExists) {
            //todo throw already exists
            return;
        }

        const subtitle = await this.subtitleService.createSubtitle(subtitleDto);

        try {
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
        } catch (error) {
            await this.subtitleService.updateSubtitleStatus(
                subtitle,
                SubtitleStatus.FAILED
            );
            console.log(error);
            //todo handle error
        } finally {
            await this.#cleanUp(subtitle);
        }
    }
}
