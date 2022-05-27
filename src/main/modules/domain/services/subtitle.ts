import { Injectable, Logger, NotFoundException } from "@nestjs/common";
import { VideoSlug } from "../models/videos/Video";
import { Subtitle } from "../models/subtitles/Subtitle";
import { VTTStorageProvider } from "../ports/VTTStorageProvider";
import { CannotFindVTTFile } from "../errors/CannotFindVTTFile";
import { GetSubtitleAccessDTO } from "../../application/dto/getSubtitleAccess";
import { SubtitleRepository } from "../ports/SubtitleRepository";
import { VTTFile } from "../models/VTTFile";

@Injectable()
export class SubtitleService {
    private readonly logger = new Logger(this.constructor.name);

    constructor(
        private readonly storageProvider: VTTStorageProvider,
        private readonly subtitles: SubtitleRepository
    ) {}

    private async validateSubtitleFileExist(subtitle: Subtitle) {
        if (!(await this.storageProvider.vttExists(subtitle))) {
            throw new CannotFindVTTFile(subtitle.getPersistenceFileName());
        }
    }

    private async getManyByVideoSlug(
        videoSlug: VideoSlug
    ): Promise<Subtitle[]> {
        return this.subtitles.getVideoSubtitles(videoSlug);
    }

    private async getSubtitle({
        videoSlug,
        language
    }: GetSubtitleAccessDTO): Promise<Subtitle> {
        return (await this.subtitles.getSubtitle(videoSlug, language)).match({
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
     * For a viceo slug given, returns all subtitles available for it
     */
    getVideoSubtitles(videoSlug: VideoSlug): Promise<Subtitle[]> {
        return this.getManyByVideoSlug(videoSlug);
    }
}
