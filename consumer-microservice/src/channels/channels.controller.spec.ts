import { KafkaContext } from '@nestjs/microservices';
import { Test, TestingModule } from '@nestjs/testing';
import { ChannelsController } from './channels.controller';
import { ChannelsService } from './channels.service';

describe('ChannelsController', () => {
  let channelsController: ChannelsController;

  const mockChannelsService = {
    createChannels: jest.fn(),
    findAll: jest.fn(),
  };

  const mockKafkaContext = {
    getTopic: jest.fn().mockReturnValue('test-topic'),
    getMessage: jest.fn(),
    getPartition: jest.fn(),
    getConsumer: jest.fn(),
    getHeartbeat: jest.fn(),
    getProducer: jest.fn(),
    getArgs: jest.fn(),
    getArgByIndex: jest.fn(),
  } as unknown as KafkaContext;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ChannelsController],
      providers: [
        {
          provide: ChannelsService,
          useValue: mockChannelsService,
        },
      ],
    })

      .compile();

    channelsController = module.get<ChannelsController>(ChannelsController);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(channelsController).toBeDefined();
  });

  it('should be able to store channels', async () => {
    mockChannelsService.createChannels.mockResolvedValue(mockChannels);
    expect(
      await channelsController.storeChannels(
        { channels: mockChannels },
        mockKafkaContext,
      ),
    ).toEqual(mockChannels);
    expect(mockChannelsService.createChannels).toHaveBeenCalledWith({
      channels: mockChannels,
    });
  });

  it('should be able to get channels', async () => {
    mockChannelsService.findAll.mockResolvedValue(mockChannels);
    expect(await channelsController.findAll()).toEqual(mockChannels);
    expect(mockChannelsService.findAll).toHaveBeenCalledWith();
  });
});

const mockChannels = [
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
];
