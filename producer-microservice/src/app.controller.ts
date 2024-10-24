import { Controller, Post } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post('channels/publish')
  async publishChannels(): Promise<void> {
    return await this.appService.publishChannels();
  }
}
