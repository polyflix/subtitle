export class InvalidVTTFileModel extends Error {
    constructor(vtt_name: string, field: string) {
        super(`${vtt_name} is invalid because of field ${field}`);
    }
}
