import { KafkaContext } from '@nestjs/microservices';
import { Test, TestingModule } from '@nestjs/testing';
import { ChannelsController } from './channels.controller';
import { ChannelsService } from './channels.service';
import { Repository } from 'typeorm';
import { Channel } from './channel.entity';
import { getRepositoryToken } from '@nestjs/typeorm';

describe('ChannelsService', () => {
  let channelsService: ChannelsService;
  let channelsRepository: Repository<Channel>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ChannelsService,
        {
          provide: getRepositoryToken(Channel),
          useValue: {
            find: jest.fn().mockResolvedValue(mockChannels),
            save: jest.fn().mockResolvedValue(mockChannels),
          },
        },
      ],
    })

      .compile();

    channelsService = module.get<ChannelsService>(ChannelsService);
    channelsRepository = module.get<Repository<Channel>>(getRepositoryToken(Channel));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(channelsService).toBeDefined();
  });

  it('should return an array of channels', async () => {
    expect(await channelsService.findAll()).toEqual(mockChannels);
  });

  it('should be able to create channels', async () => {
    expect(
      await channelsService.createChannels({ channels: mockChannels }),
    ).toEqual(mockChannels);
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
