export class CannotFindVTTFile extends Error {
    constructor(file: string) {
        super(file);
    }
}
