import { HttpService } from '@nestjs/axios';
import { AxiosError } from 'axios';
import { Injectable, Logger } from '@nestjs/common';
import { catchError, firstValueFrom } from 'rxjs';
import { PublicChannelsResponse } from 'src/channels/channel.dto';


const GET_THINGSSPEAK_PUBLIC_CHANNELS_URL = "https://api.thingspeak.com/channels/public.json"

@Injectable()
export class ChannelsService {
  constructor(private readonly httpService: HttpService) {}

  private readonly logger = new Logger(ChannelsService.name);


  async loadChannels(): Promise<PublicChannelsResponse> {

    const { data } = await firstValueFrom(
        this.httpService.get<PublicChannelsResponse>(GET_THINGSSPEAK_PUBLIC_CHANNELS_URL).pipe(
          catchError((error: AxiosError) => {
            this.logger.error(error.response.data);
            throw 'An error happened!';
          }),
        ),
      );

      return data;
  }
}