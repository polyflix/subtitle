import { Controller, Get, Logger } from "@nestjs/common";
import { Span } from "nestjs-otel";
import { AppService } from "./app.service";

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @Span("Some span")
  getHello(): string {
    return this.appService.getHello();
  }
}
