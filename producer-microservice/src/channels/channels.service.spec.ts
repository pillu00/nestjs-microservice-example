import { Test, TestingModule } from '@nestjs/testing';
import { HttpService } from '@nestjs/axios';
import { of, throwError } from 'rxjs';
import { AxiosError } from 'axios';
import { ChannelsService } from './channels.service';
import { PublicChannelsResponse } from './channel.dto';

describe('Channelservice', () => {
  let channelsService: ChannelsService;

  const mockHttpService = {
    get: jest.fn(),
  };

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [],
      providers: [
        ChannelsService,
        {
          provide: HttpService,
          useValue: mockHttpService,
        },
      ],
    })

      .compile();

    channelsService = app.get<ChannelsService>(ChannelsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(channelsService).toBeDefined();
  });

  it('should be able to load data from api successfully', async () => {
    mockHttpService.get.mockReturnValue(
      of({
        data: mockChannelsDataResponse,
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {},
      }),
    );

    expect(await channelsService.loadChannels()).toEqual(
      mockChannelsDataResponse,
    );
  });

  it('should throw error if api call fails', async () => {
    mockHttpService.get.mockReturnValue(
      throwError(
        () =>
          new AxiosError(null, '500', null, null, {
            data: { message: 'Request Failed!!' },
            status: 500,
            statusText: '',
            headers: {},
            config: null,
          }),
      ),
    );

    expect(async () => {
      await channelsService.loadChannels();
    }).rejects.toEqual('An error happened!');
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
