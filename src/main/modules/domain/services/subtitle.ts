import { Injectable, Logger, NotFoundException } from "@nestjs/common";
import { VideoSlug } from "../models/videos/Video";
import { Subtitle } from "../models/subtitles/Subtitle";
import { VTTStorageProvider } from "../ports/VTTStorageProvider";
import { CannotFindVTTFile } from "../errors/CannotFindVTTFile";
import { GetSubtitleAccessDTO } from "../../application/dto/getSubtitleAccess";
import { SubtitleRepository } from "../ports/SubtitleRepository";
import { VTTFile } from "../models/VTTFile";
import { SubtitleLanguage } from "../models/subtitles/SubtitleLanguage";
import { SubtitleStatus } from "../models/subtitles/SubtitleStatus";
import { SubtitleDto } from "../../adapters/api/models/SubtitleDto";

@Injectable()
export class SubtitleService {
    private readonly logger = new Logger(this.constructor.name);

    constructor(
        private readonly storageProvider: VTTStorageProvider,
        private readonly subtitleRepository: SubtitleRepository
    ) {}

    private async validateSubtitleFileExist(subtitle: Subtitle) {
        if (!(await this.storageProvider.vttExists(subtitle))) {
            throw new CannotFindVTTFile(subtitle.getVttFileName());
        }
    }

    private async getManyByVideoSlug(
        videoSlug: VideoSlug
    ): Promise<Subtitle[]> {
        return this.subtitleRepository.getVideoSubtitles(videoSlug);
    }

    async getSubtitle({
        videoSlug,
        language
    }: GetSubtitleAccessDTO): Promise<Subtitle> {
        return (
            await this.subtitleRepository.getSubtitle(videoSlug, language)
        ).match({
            Some: (subtitle) => subtitle,
            None: () => {
                throw new NotFoundException(
                    { videoSlug, language },
                    "could not find object"
                );
            }
        });
    }

    /**
     * This validate whether a requested subtitle exist. If it exists then we
     * give a PSU for the video. If not, we throw an error
     * @param accessDTO
     */
    async getVTTFile(accessDTO: GetSubtitleAccessDTO): Promise<VTTFile> {
        const subtitle = await this.getSubtitle(accessDTO);
        await this.validateSubtitleFileExist(subtitle);
        return this.storageProvider.getVttFile(subtitle);
    }

    /**
     * For a video slug given, returns all subtitleRepository available for it
     */
    getVideoSubtitles(videoSlug: VideoSlug): Promise<Subtitle[]> {
        return this.getManyByVideoSlug(videoSlug);
    }

    createSubtitle(subtitleDto: SubtitleDto): Promise<Subtitle> {
        const subtitle = SubtitleDto.into(subtitleDto);
        return this.subtitleRepository.saveSubtitle(subtitle);
    }

    saveSubtitle(subtitle: Subtitle): Promise<Subtitle> {
        return this.subtitleRepository.saveSubtitle(subtitle);
    }

    updateSubtitle(subtitle: Subtitle): Promise<Subtitle> {
        return this.subtitleRepository.saveSubtitle(subtitle);
    }

    updateSubtitleStatus(
        subtitle: Subtitle,
        subtitleStatus: SubtitleStatus
    ): Promise<Subtitle> {
        subtitle.status = subtitleStatus;
        return this.updateSubtitle(subtitle);
    }
    async checkSubtitleExists(
        videoSlug: VideoSlug,
        language: SubtitleLanguage
    ): Promise<boolean> {
        const subtitles = await this.subtitleRepository.getVideoSubtitles(
            videoSlug
        );
        let subtitle;
        for (subtitle of subtitles) {
            if (
                subtitle.language === language &&
                subtitle.status !== SubtitleStatus.FAILED
            ) {
                return true;
            }
        }
        return false;
    }
}
