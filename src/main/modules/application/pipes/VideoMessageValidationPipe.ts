import { ArgumentMetadata, PipeTransform } from "@nestjs/common";
import { VideoMessage } from "../messages/video-message";

export class VideoMessageValidationPipe implements PipeTransform {
    transform(value: any, metadata: ArgumentMetadata) {
        const videoMessage = new VideoMessage();
        Object.assign(videoMessage, value);
        videoMessage.validate();
        return videoMessage;
    }
}
