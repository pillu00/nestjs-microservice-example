import { Injectable } from '@nestjs/common';
import { KafkaProducerService } from './producer/kafka-producer.service';
import { ChannelsService } from './channels/channels.service';

@Injectable()
export class AppService {
  constructor(
    private readonly channelsService: ChannelsService,
    private readonly kafkaProducerService: KafkaProducerService,
  ) {}

  async publishChannels(): Promise<void> {
    const channelsData = await this.channelsService.loadChannels();
    return this.kafkaProducerService.publish(channelsData.channels);
  }
}
