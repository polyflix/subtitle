import { DomainException } from "./DomainException";

export class CannotFindVTTFile extends DomainException {
    constructor(file: string) {
        super(file);
    }
}
