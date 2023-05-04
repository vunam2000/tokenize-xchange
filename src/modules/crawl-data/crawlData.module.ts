import { Module } from '@nestjs/common';
import { CrawlDataService } from './crawlData.service';

@Module({
  imports: [],
  providers: [CrawlDataService],
  exports: [CrawlDataService],
})
export class CrawlDataModule {}
