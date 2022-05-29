import { DomainException } from "./DomainException";

export class InvalidVTTFileModel extends DomainException {
    constructor(vtt_name: string, field: string) {
        super(`${vtt_name} is invalid because of field ${field}`);
    }
}
