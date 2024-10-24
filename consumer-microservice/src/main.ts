import { NestFactory } from '@nestjs/core';
import { Transport, MicroserviceOptions } from '@nestjs/microservices';
import { AppModule } from './app.module';
import { broker, groupId, clientId } from '../kafka-config.json';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.KAFKA,
      options: {
        client: {
          clientId,
          brokers: [broker],
        },
        consumer: {
          groupId: groupId,
        },
      },
    },
  );

  await app.listen();

}
bootstrap();
