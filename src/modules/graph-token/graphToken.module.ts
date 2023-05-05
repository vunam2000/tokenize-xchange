import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CrawlDataModule } from '../crawl-data/crawlData.module';

import { GraphTokenController } from './graphToken.controller';

import { GraphTokenService } from './graphToken.service';

import { TriangleArbitrage } from '../../entities';

@Module({
  imports: [CrawlDataModule, TypeOrmModule.forFeature([TriangleArbitrage])],
  controllers: [GraphTokenController],
  providers: [GraphTokenService],
})
export class GraphTokenModule {}
