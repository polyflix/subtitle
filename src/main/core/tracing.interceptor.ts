import {
    CallHandler,
    ExecutionContext,
    Injectable,
    NestInterceptor
} from "@nestjs/common";
import { Observable } from "rxjs";
import { TraceService } from "nestjs-otel";

@Injectable()
export class TracingInjectionInterceptor implements NestInterceptor {
    private static EXPECTED_B3_ARRAY_LENGTH = 3;
    constructor(private readonly traceService: TraceService) {}

    intercept(
        context: ExecutionContext,
        next: CallHandler
    ): Observable<unknown> {
        const b3Context = this.extractB3Headers(context);

        if (
            b3Context.length <
            TracingInjectionInterceptor.EXPECTED_B3_ARRAY_LENGTH
        ) {
            return next.handle();
        }

        this.injectB3ContextToTrace(b3Context);
        return next.handle();
    }

    extractB3Headers(context: ExecutionContext): string[] {
        const b3: string = context.switchToHttp().getRequest().headers["b3"];
        if (!b3) return [];

        return b3.split("-");
    }

    injectB3ContextToTrace(spanContext: string[]) {
        const traceCtx = this.traceService.getSpan().spanContext();
        traceCtx.traceId = spanContext[0];
        traceCtx.spanId = spanContext[1];
        traceCtx.isRemote = true;
        traceCtx.traceFlags = Number(spanContext[2]);
    }
}
