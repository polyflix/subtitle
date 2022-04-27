import { KafkaOptions, Transport } from "@nestjs/microservices";

export const KAFKA_CLIENT = "KAFKA_CLIENT";

export const microserviceConfig = (config): KafkaOptions => ({
  transport: Transport.KAFKA,
  options: {
    client: {
      clientId: config["client"]["clientId"],
      brokers: config["client"]["brokers"].map((v) => `${v.host}:${v.port}`)
    },
    consumer: {
      groupId: config["consumer"]["groupId"],
      allowAutoTopicCreation: config["consumer"]["allowAutoTopicCreation"]
    }
  }
});
