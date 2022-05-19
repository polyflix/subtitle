import { Logger } from "@nestjs/common";

export class SubtitleGenerationService {
    private readonly logger = new Logger(SubtitleGenerationService.name);

    constructor() {}

    /**
     * Take an audio file and upload it to TextToSpeech service
     * @param TODO
     * @private
     */
    private uploadToSpeechToText(TODO: any) {}

    /**
     * Ask TextToSpeech ports to run it
     * @private
     */
    private runSpeechToText() {}

    /**
     * Once the work is done for speech to text, we take it back
     * @param TODO
     * @private
     */
    private downloadFromSpeechToText(TODO: any) {}

    /**
     * We upload the VTT file definitely to persistent storage
     * @param TODO
     * @private
     */
    private uploadToPersistent(TODO: any) {}

    /**
     * Remove any folder / file created for a generation
     * @param TODO
     * @private
     */
    private cleanUp(TODO: any) {}
}
