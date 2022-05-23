import { Logger } from "@nestjs/common";

export class SubtitleGenerationService {
    private readonly logger = new Logger(SubtitleGenerationService.name);

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
    private uploadToPersistent(TODO: any) {
        this.logger.log(
            "SubtitleGenerationService.uploadToPersistent() to be implemented"
        );
    }

    /**
     * Remove any folder / file created for a generation
     * @param TODO
     * @private
     */
    private cleanUp(TODO: any) {
        this.logger.log(
            "SubtitleGenerationService.cleanUp() to be implemented"
        );
    }
}
