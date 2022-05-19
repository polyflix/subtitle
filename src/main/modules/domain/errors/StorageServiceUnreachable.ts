export class StorageServiceUnreachable extends Error {
    constructor(msg: string) {
        super(msg);
        this.name = StorageServiceUnreachable.name;
    }
}
