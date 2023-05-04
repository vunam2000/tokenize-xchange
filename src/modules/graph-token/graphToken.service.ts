import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import { Cache } from 'cache-manager';
import { CrawlDataService } from '../crawl-data/crawlData.service';

@Injectable()
export class GraphTokenService {
  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private readonly crawlDataService: CrawlDataService,
  ) {}
  async getBookTicketOfTokenPair(tokenPair: string) {
    return await this.crawlDataService.getDataFromCache(tokenPair);
  }
}
