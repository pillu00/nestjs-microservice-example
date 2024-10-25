import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Channel } from './channels/channel.entity';
import { ChannelsModule } from './channels/channels.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mongodb',
      host: 'mongodb',
      database: 'consumer',
      entities: [Channel],
      synchronize: true,
      logging: true,
    }),
    ChannelsModule,
    AuthModule,
    UsersModule,
  ],
})
export class AppModule {}
