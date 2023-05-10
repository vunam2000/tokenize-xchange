import { Module, MiddlewareConsumer } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TerminusModule } from '@nestjs/terminus';
import * as Joi from '@hapi/joi';
import { APP_FILTER } from '@nestjs/core';

import { LoggerModule } from './modules/log/logs.module';
import { DatabaseModule } from './modules/database/database.module';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/user/users.module';
import { CrawlDataModule } from './modules/crawl-data/crawlData.module';

import LoggerMiddleware from './configs/middlewares/logger.middleware';
import { AllExceptionsFilter } from './configs/filters/catchError';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CacheModule } from './modules/cache/cache.module';
import { GraphTokenModule } from './modules/graph-token/graphToken.module';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  providers: [
    AppService,
    {
      provide: APP_FILTER,
      useClass: AllExceptionsFilter,
    },
  ],
  imports: [
    ScheduleModule.forRoot(),
    TerminusModule,
    LoggerModule,
    ConfigModule.forRoot({
      validationSchema: Joi.object({
        // PostgresQL
        POSTGRES_HOST: Joi.string().required(),
        POSTGRES_PORT: Joi.number().required(),
        POSTGRES_USER: Joi.string().required(),
        POSTGRES_PASSWORD: Joi.string().required(),
        POSTGRES_DB: Joi.string().required(),

        // Port server
        PORT: Joi.number(),

        // JWT
        JWT_SECRET: Joi.string().required(),
        JWT_EXPIRATION_TIME: Joi.string().required(),
        JWT_REFRESH_TOKEN_SECRET: Joi.string().required(),
        JWT_REFRESH_TOKEN_EXPIRATION_TIME: Joi.string().required(),

        CACHE_HOST: Joi.string().required(),
        CACHE_PORT: Joi.string().required(),

        BINANCE_API_KEY: Joi.string().required(),
        BINANCE_SECRET_KEY: Joi.string().required(),
      }),
    }),
    DatabaseModule,
    CacheModule,
    CrawlDataModule,
    AuthModule,
    UsersModule,
    GraphTokenModule,
  ],
  controllers: [AppController],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
