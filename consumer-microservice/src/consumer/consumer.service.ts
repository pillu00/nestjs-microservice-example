import { Injectable } from '@nestjs/common';

@Injectable()
export class ConsumerService {
  // TODO: define type
  storeChannels(message: any): void {
    console.log('store message called!!');
  }
}
