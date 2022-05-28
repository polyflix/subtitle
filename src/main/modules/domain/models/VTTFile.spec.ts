import { SubtitleLanguage } from "./subtitles/SubtitleLanguage";
import { VTTFile } from "./VTTFile";

/**
 * As a markup, we could use runner groups for runninng different type of tests
 * https://stackoverflow.com/questions/50171932/run-jest-test-suites-in-groups
 */
describe("[VTTFile] internal methods", () => {
    test("isLanguage() truthy is correct language", () => {
        const language = SubtitleLanguage.Fr;
        const vtt = new VTTFile("test", "test", language);

        expect(vtt.isLanguage(language)).toBeTruthy();
    });
});
