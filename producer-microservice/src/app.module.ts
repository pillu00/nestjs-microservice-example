import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ChannelsModule } from './channels/channels.module';
import { KafkaProducerModule } from './producer/kafka-producer.module';

@Module({
  imports: [ChannelsModule, KafkaProducerModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
