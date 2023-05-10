import {
  CACHE_MANAGER,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  Logger,
} from '@nestjs/common';
import { Cache } from 'cache-manager';
import Binance from 'binance-api-node';
import { TOKEN_PAIRS } from '../../configs/constants/token';
import { Cron } from '@nestjs/schedule';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class CrawlDataService {
  private readonly logger = new Logger(CrawlDataService.name);
  private client;

  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private configService: ConfigService,
  ) {
    // Authenticated client, can make signed calls
    this.client = Binance({
      apiKey: this.configService.get('BINANCE_API_KEY'),
      apiSecret: this.configService.get('BINANCE_SECRET_KEY'),
    });
  }

  async storeDataToCache(key: string, value: any) {
    try {
      await this.cacheManager.set(key, value);
    } catch (err) {
      this.logger.error(err);
    }
  }

  async getDataFromCache(key: string): Promise<{
    bestAsk: string;
    bestAskQnt: string;
    bestBid: string;
    bestBidQnt: string;
  }> {
    return await this.cacheManager.get(key);
  }

  @Cron('*/1 * * * * *')
  async crawlBinanceBookTicker() {
    const symbols = [];
    for (const tokenPair of TOKEN_PAIRS) {
      const symbol = tokenPair[0] + tokenPair[1];
      symbols.push(symbol);
    }

    this.logger.log('Crawl ticker: ' + symbols);
    this.client.ws.bookTicker(symbols, async (ticker) => {
      this.logger.log(`Ticker: ${ticker}`);

      await this.storeDataToCache(ticker?.symbol, ticker);
    });
  }
}
