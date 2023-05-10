import { Module } from '@nestjs/common';
import { CrawlDataService } from './crawlData.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule],
  providers: [CrawlDataService],
  exports: [CrawlDataService],
})
export class CrawlDataModule {}
