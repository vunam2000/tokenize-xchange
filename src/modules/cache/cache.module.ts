import { CacheStore } from '@nestjs/cache-manager';
import { Module, CacheModule as NestCacheModule } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
//@ts-ignore
import { redisStore } from 'cache-manager-redis-store';

@Module({
  imports: [
    NestCacheModule.registerAsync({
      isGlobal: true,
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        const store = await redisStore({
          socket: {
            host: configService.get('CACHE_HOST'),
            port: configService.get('CACHE_PORT'),
          },
        });
        return {
          store: store as unknown as CacheStore,
          ttl: 600,
        };
      },
    }),
  ],
})
export class CacheModule {}
