import { Controller, Get, Logger } from '@nestjs/common';
import {
  Ctx,
  KafkaContext,
  MessagePattern,
  Payload,
} from '@nestjs/microservices';

import { kafkaTopic } from '../../kafka-config.json';

import { Public } from '../auth/decorators/public.decorator';
import { ChannelsService } from './channels.service';
import { CreateChannelDto } from './dto/create-channel.dto';
import { Channel } from './channel.entity';

@Controller()
export class ChannelsController {
  constructor(private readonly channelsService: ChannelsService) {}

  private readonly logger = new Logger(ChannelsController.name);

  @Public()
  @MessagePattern(kafkaTopic)
  async storeChannels(
    @Payload() message: CreateChannelDto,
    @Ctx() context: KafkaContext,
  ): Promise<Channel[]> {
    this.logger.log(`Got messgae from Topic: ${context.getTopic()}`);
    const savedChannels = await this.channelsService.createChannels(message);
    this.logger.log('Saved Channels to the database !!');

    return savedChannels;
  }

  @Get('channels')
  findAll(): Promise<Channel[]> {
    this.logger.log('Load Channels from DB !!');
    return this.channelsService.findAll();
  }
}
