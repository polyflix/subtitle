import {
    ArgumentsHost,
    Catch,
    ExceptionFilter,
    HttpStatus,
    Logger
} from "@nestjs/common";
import { DomainException } from "../../domain/errors/DomainException";
import { CannotFindVTTFile } from "../../domain/errors/CannotFindVTTFile";
import { HttpAdapterHost } from "@nestjs/core";

@Catch(DomainException)
export class DomainExceptionFilter implements ExceptionFilter<DomainException> {
    readonly #logger = new Logger(this.constructor.name);
    constructor(private readonly httpAdapterHost: HttpAdapterHost) {}

    catch(exception: DomainException, host: ArgumentsHost): void {
        const ctx = host.switchToHttp();
        const { httpAdapter } = this.httpAdapterHost;
        const response = ctx.getResponse<Response>();

        let status = HttpStatus.INTERNAL_SERVER_ERROR;

        // TODO: Move to something better
        if (exception instanceof CannotFindVTTFile) {
            status = HttpStatus.NOT_FOUND;
        }

        this.#logger.debug(
            `Mapping error ${exception.constructor.name} (${exception}) to status ${status}`
        );
        httpAdapter.reply(response, { statusCode: status }, status);
    }
}
