import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';

describe('AppController', () => {
  let appController: AppController;

  const mockPublishChannels = jest.fn();
  const mockAppService = {
    publishChannels: mockPublishChannels,
  };

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [
        {
          provide: AppService,
          useValue: mockAppService,
        },
      ],
    })

      .compile();

    appController = app.get<AppController>(AppController);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be able to run publish channels', async () => {
    mockPublishChannels.mockImplementation(() => Promise.resolve());
    await appController.publishChannels();
    expect(mockAppService.publishChannels).toHaveBeenCalledTimes(1);
  });

  it('should throw error if publishChannels throws one', async () => {
    mockPublishChannels.mockImplementation(() =>
      Promise.reject('An Error Occured!!'),
    );
    expect(async () => {
      await appController.publishChannels();
    }).rejects.toEqual('An Error Occured!!');
    expect(mockAppService.publishChannels).toHaveBeenCalledTimes(1);
  });
});
