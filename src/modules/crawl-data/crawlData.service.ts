import {
  CACHE_MANAGER,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
} from '@nestjs/common';
import { Cache } from 'cache-manager';
import Binance from 'binance-api-node';
import { TOKEN_PAIRS } from '../../configs/constants/token';

@Injectable()
export class CrawlDataService {
  private client;

  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {
    // Authenticated client, can make signed calls
    this.client = Binance({
      apiKey: process.env.BINANCE_API_KEY,
      apiSecret: process.env.BINANCE_SECRET_KEY,
    });
  }

  async storeDataToCache(key: string, value: any) {
    await this.cacheManager.set(key, value);
  }

  async getDataFromCache(key: string): Promise<{
    bestAsk: string;
    bestAskQnt: string;
    bestBid: string;
    bestBidQnt: string;
  }> {
    return await this.cacheManager.get(key);
  }

  async crawlBinanceBookTicker() {
    const symbols = [];
    for (const tokenPair of TOKEN_PAIRS) {
      const symbol = tokenPair[0] + tokenPair[1];
      symbols.push(symbol);
    }

    this.client.ws.bookTicker(symbols, async (ticker) => {
      this.storeDataToCache(ticker?.symbol, ticker);
    });
  }
}
