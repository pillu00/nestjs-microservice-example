import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ChannelsService } from './channels.service';

@Module({
  imports: [HttpModule],
  providers: [ChannelsService],
  exports: [ChannelsService]
})
export class ChannelsModule {}