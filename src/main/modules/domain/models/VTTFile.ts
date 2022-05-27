import { SubtitleLanguage } from "./subtitles/SubtitleLanguage";
import { InvalidVTTFileModel } from "../errors/InvalidVTTFileModel";

export class VTTFile {
    constructor(
        readonly name: string,
        readonly accessUrl: string,
        readonly language: SubtitleLanguage
    ) {
        if (!this.name) {
            throw new InvalidVTTFileModel(this.name, "name");
        }
    }

    isLanguage(test: SubtitleLanguage): boolean {
        return this.language === test;
    }
}
