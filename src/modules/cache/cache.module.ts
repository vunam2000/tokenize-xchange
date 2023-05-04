import { Module, CacheModule as NestCacheModule } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    NestCacheModule.register({
      imports: [ConfigModule],
      inject: [ConfigService],
      isGlobal: true,
      useFactory: (configService: ConfigService) => {
        return {
          ttl: configService.get('CACHE_TTL'),
          host: configService.get('CACHE_HOST'), //default host
          port: configService.get('CACHE_PORT'),
        };
      },
    }),
  ],
})
export class CacheModule {}
