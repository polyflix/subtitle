import { DomainException } from "./DomainException";

export class SubtitleRepositoryError extends DomainException {
    constructor(msg: string) {
        super(msg);
    }
}
