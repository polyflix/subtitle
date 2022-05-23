import { Logger } from "@nestjs/common";

export class VideoService {
    private readonly logger = new Logger(this.constructor.name);

    /**
     * Download a video from VTTStorageProvider
     * @param TODO
     */
    async downloadVideo(TODO: any) {
        // TODO: Implement me
    }

    /**
     * Take a video file locally, and split video with audio
     * @param TODO
     */
    async splitWithAudio(TODO: any) {
        // TODO: Implement me
    }
}
