import { Logger } from "@nestjs/common";
import * as Path from "path";
import { mkdirSync } from "fs";

export type VideoSlug = string;

export class Video {
    protected readonly logger = new Logger(Video.name);
    private readonly WORKING_DIR = "/tmp/subtitle-generator/";

    /**
     *
     * @param slug -- Video slug
     * @param title -- Video title
     * @param source -- Video URL to VTTStorage
     */
    constructor(
        public readonly slug: VideoSlug,
        public readonly title: string,
        public readonly source: string
    ) {
        this.createWorkingDirectory();
    }

    private createWorkingDirectory() {
        const path = `${this.WORKING_DIR}/${this.slug}`;
        try {
            mkdirSync(path, { recursive: true });
        } catch (e) {
            this.logger.error(
                "Failed to create path, path: " + path + ", reason: " + e
            );
        }
    }

    /**
     * Define where the video should be installed on the pod
     */
    getLocalVideoPath() {
        return Path.join(
            this.WORKING_DIR,
            this.slug,
            `video.${this.getSourceExtension()}`
        );
    }

    /**
     * Define where the audio should be installed on the pod
     */
    getLocalAudioPath() {
        return Path.join(this.WORKING_DIR, this.slug, `audio.mp4`);
    }

    /**
     * Take only the extension from video source
     */
    private getSourceExtension() {
        return Path.extname(this.source);
    }
}
