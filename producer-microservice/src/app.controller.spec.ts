import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ChannelsModule } from './channels/channels.module';
import { KafkaProducerModule } from './producer/kafka-producer.module';

describe('AppController', () => {
  let appController: AppController;
  let appService: AppService;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      imports: [ChannelsModule, KafkaProducerModule],
      controllers: [AppController],
      providers: [AppService],
    }).compile();

    appService = app.get<AppService>(AppService);
    appController = app.get<AppController>(AppController);
  });

  describe('root', () => {
    it('should be able to run publish channels', async () => {
      jest.spyOn(appService, 'publishChannels').mockImplementation(() => Promise.resolve());
      await appController.publishChannels()
    });
  });
});
