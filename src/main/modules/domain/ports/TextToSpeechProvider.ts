import { Logger } from "@nestjs/common";

export abstract class TextToSpeechProvider {
    protected logger = new Logger(this.constructor.name);
    /**
     * Upload the file to the provider
     * @param filePath
     */
    abstract upload(filePath: string): Promise<void>;
}
