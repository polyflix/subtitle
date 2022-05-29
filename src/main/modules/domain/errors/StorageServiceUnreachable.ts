import { DomainException } from "./DomainException";

export class StorageServiceUnreachable extends DomainException {
    constructor(msg: string) {
        super(msg);
        this.name = StorageServiceUnreachable.name;
    }
}
