import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MongoRepository } from 'typeorm';

import { Channel, Tag } from './channel.entity';
import { ChannelDto, CreateChannelDto } from './dto/create-channel.dto';

@Injectable()
export class ChannelsService {
  constructor(
    @InjectRepository(Channel)
    private readonly channelRepository: MongoRepository<Channel>,
  ) {}

  async createChannels(createChannelDto: CreateChannelDto): Promise<Channel[]> {
    const channelsToSave = createChannelDto.channels.map(this.mapDtoToEntity);

    return this.channelRepository.save(channelsToSave);
  }

  async findAll(): Promise<Channel[]> {
    return this.channelRepository.find();
  }

  mapDtoToEntity(channelDto: ChannelDto): Channel {
    const channel = new Channel();

    channel.channelId = channelDto.id;
    channel.description = channelDto.description;
    channel.name = channelDto.name;
    channel.latitude = channelDto.latitude;
    channel.longitude = channelDto.longitude;

    channel.created_at = channelDto.created_at;
    channel.elevation = channelDto.elevation;
    channel.last_entry_id = channelDto.last_entry_id;
    channel.url = channelDto.url;

    channel.ranking = channelDto.ranking;
    channel.github_url = channelDto.github_url;
    channel.public_flag = channelDto.public_flag;

    channel.tags = channelDto.tags.map((tagDto) => {
      const tag = new Tag();
      tag.id = tagDto.id;
      tag.name = tagDto.name;

      return tag;
    });

    return channel;
  }
}
