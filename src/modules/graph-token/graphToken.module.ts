import { Module } from '@nestjs/common';
import { CrawlDataModule } from '../crawl-data/crawlData.module';
import { GraphTokenController } from './graphToken.controller';
import { GraphTokenService } from './graphToken.service';

@Module({
  imports: [CrawlDataModule],
  controllers: [GraphTokenController],
  providers: [GraphTokenService],
})
export class GraphTokenModule {}
