import { VideoState } from "./video-state";
import { InvalidMessage } from "../errors/InvalidMessage";
import { Logger } from "@nestjs/common";

export class VideoMessage {
    readonly #logger = new Logger(this.constructor.name);

    private id: string;

    private trigger: VideoState;

    // TODO: Implement a DTO with only needed fields
    private fields: unknown;

    validate() {
        this.#logger.debug("VideoMessage.video()");
        if (!this.id) {
            throw new InvalidMessage("Cannot parse properly ID");
        }

        if (!this.trigger) {
            throw new InvalidMessage("Cannot parse trigger");
        }
    }

    get slug() {
        return this.id;
    }

    get state() {
        return this.trigger;
    }
}
