import {
  Injectable,
  Logger,
  OnApplicationBootstrap,
  OnApplicationShutdown
} from "@nestjs/common";
import { ClientProxy } from "@nestjs/microservices";
import { ISLOCAL } from "./config/loader.config";
import { InjectKafkaClient } from "./core/decorators/kafka-inject.decorator";

@Injectable()
export class AppService
  implements OnApplicationBootstrap, OnApplicationShutdown
{
  private readonly logger = new Logger(AppService.name);

  constructor(@InjectKafkaClient() private readonly kafkaClient: ClientProxy) {}

  async onApplicationBootstrap() {
    if (ISLOCAL) {
      this.kafkaClient
        .connect()
        .then(() => this.logger.log("Kafka client connection open"))
        .catch(() => this.logger.error("Can't open Kafka client connection"));
    } else {
      try {
        await this.kafkaClient.connect();
        this.logger.log("Kafka client connection open");
      } catch (error) {
        this.logger.error("Can't open Kafka client connection");
      }
    }
  }

  onApplicationShutdown() {
    this.kafkaClient.close();
    this.logger.log("Kafka client connection closed");
  }
}
