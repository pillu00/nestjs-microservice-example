import { Controller, Logger } from '@nestjs/common';
import {
  Ctx,
  KafkaContext,
  MessagePattern,
  Payload,
} from '@nestjs/microservices';
import { ConsumerService } from './consumer.service';

import { kafkaTopic } from '../../kafka-config.json';

@Controller()
export class ConsumerController {
  constructor(private readonly consumerService: ConsumerService) {}
  private readonly logger = new Logger(ConsumerController.name);

  // TODO: define type
  @MessagePattern(kafkaTopic)
  storeChannels(@Payload() message: any, @Ctx() context: KafkaContext): void {
    this.logger.debug(`Topic: ${context.getTopic()}`, `Message: ${JSON.stringify(message)}`);
    return this.consumerService.storeChannels(message);
  }
}
