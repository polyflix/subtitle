import { DomainException } from "./DomainException";

export class CannotFindVideoFile extends DomainException {
    constructor(file: string) {
        super(file);
    }
}
