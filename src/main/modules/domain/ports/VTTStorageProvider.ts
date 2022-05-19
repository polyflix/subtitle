import { VTTFile } from "../models/VTTFile";
import { Logger } from "@nestjs/common";

export abstract class VTTStorageProvider {
    protected logger = new Logger(this.constructor.name);

    abstract uploadVTT(file: VTTFile): Promise<void>;
}
