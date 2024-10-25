import { Injectable } from '@nestjs/common';
import { Kafka, Producer } from 'kafkajs';

import {
  clientId,
  kafkaTopic,
  broker,
  connectionTimeout,
  authenticationTimeout,
  reauthenticationThreshold,
} from '../../kafka-config.json';
import { Channel } from 'src/channels/channel.dto';

@Injectable()
export class KafkaProducerService {
  private readonly kafkaInstance: Kafka;
  private producer: Producer;

  constructor() {
    this.kafkaInstance = new Kafka({
      clientId: clientId,
      brokers: [broker],
      connectionTimeout: connectionTimeout,
      authenticationTimeout: authenticationTimeout,
      reauthenticationThreshold: reauthenticationThreshold,
    });

    this.producer = this.kafkaInstance.producer();
  }

  async publish(channels: Channel[]): Promise<void> {
    await this.producer.connect();
    await this.producer.send({
      topic: kafkaTopic,
      messages: [{ value: JSON.stringify({ channels }) }],
    });
  }
}
