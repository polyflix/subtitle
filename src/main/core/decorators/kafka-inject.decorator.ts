import { Inject } from "@nestjs/common";
import { KAFKA_CLIENT } from "src/main/config/kafka.config";

export const InjectKafkaClient = () => {
  return Inject(KAFKA_CLIENT);
};
