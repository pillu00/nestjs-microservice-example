import { Test, TestingModule } from '@nestjs/testing';
import { AppService } from './app.service';
import { ChannelsService } from './channels/channels.service';
import { KafkaProducerService } from './producer/kafka-producer.service';
import { PublicChannelsResponse } from './channels/channel.dto';

describe('AppService', () => {
  let appService: AppService;

  const mockChannelsService = {
    loadChannels: jest.fn(),
  };

  const mockKafkaProducerService = {
    publish: jest.fn(),
  };

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [],
      providers: [
        AppService,
        {
          provide: ChannelsService,
          useValue: mockChannelsService,
        },
        {
          provide: KafkaProducerService,
          useValue: mockKafkaProducerService,
        },
      ],
    })

      .compile();

    appService = app.get<AppService>(AppService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(appService).toBeDefined();
  });

  it('should successfully publish channels', async () => {
    mockChannelsService.loadChannels.mockResolvedValue(
      mockChannelsDataResponse,
    );

    expect(await appService.publishChannels()).resolves;

    expect(mockChannelsService.loadChannels).toHaveBeenCalledWith();
    expect(mockKafkaProducerService.publish).toHaveBeenCalledWith(
      mockChannelsDataResponse.channels,
    );
  });

  it('should not be able to publish channels if load channels fails', async () => {
    mockChannelsService.loadChannels.mockRejectedValue('An Error Occurred!!');

    expect(async () => {
      await appService.publishChannels();
    }).rejects.toEqual('An Error Occurred!!');

    expect(mockChannelsService.loadChannels).toHaveBeenCalledWith();
    expect(mockKafkaProducerService.publish).not.toHaveBeenCalled();
  });

  it('should throw error if kafka publish throws one', async () => {
    mockChannelsService.loadChannels.mockResolvedValue(
      mockChannelsDataResponse,
    );

    mockKafkaProducerService.publish.mockRejectedValue('An Error Occurred!!');

    expect(async () => {
      await appService.publishChannels();
    }).rejects.toEqual('An Error Occurred!!');

    expect(mockChannelsService.loadChannels).toHaveBeenCalledWith();
    expect(mockKafkaProducerService.publish).rejects;
  });
});

const mockChannelsDataResponse: PublicChannelsResponse = {
  pagination: {
    current_page: 1,
    per_page: 1,
    total_entries: 3361,
  },
  channels: [
    {
      id: 1293177,
      name: 'San Diego - Estación Meteorológica',
      description:
        'San Diego, Cerro Largo, Uruguay\r\nEstación Meteorológica Solar\r\n(Temp, Hum, Presion, Lluvia, Viento).\r\nESP8266, UNO R3, BME 680\r\nUpdate Interval - 15 seg\r\nhttps://clima.santiago.ovh/',
      latitude: '-31.9939484',
      longitude: '-53.9575388',
      created_at: '2021-01-30T16:32:32Z',
      elevation: '136',
      last_entry_id: 4713277,
      public_flag: true,
      url: 'http://clima.santiago.ovh/',
      ranking: 100,
      github_url: 'https://github.com/santiagoacevedo',
      tags: [
        {
          id: 3063,
          name: 'uruguay',
        },
        {
          id: 12931428,
          name: 'cerro largo',
        },
        {
          id: 23638,
          name: 'san diego',
        },
        {
          id: 12931429,
          name: 'estacion solar',
        },
        {
          id: 244,
          name: 'solar',
        },
        {
          id: 12931430,
          name: 'cerro largo uy',
        },
        {
          id: 12931431,
          name: 'uy',
        },
      ],
    },
  ],
};
