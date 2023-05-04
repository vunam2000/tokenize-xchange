import {
  CACHE_MANAGER,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
} from '@nestjs/common';
import { Cache } from 'cache-manager';
import Binance from 'binance-api-node';

@Injectable()
export class CrawlDataService {
  private client;
  public ticketPairs = ['BTCUSDT'];

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

  async getDataFromCache(key: string) {
    return await this.cacheManager.get(key);
  }

  async crawlBinanceBookTicket() {
    for (const ticketPair of this.ticketPairs) {
      this.client.ws.bookTicker(ticketPair, async (ticker) => {
        this.storeDataToCache(ticketPair, ticker);
      });
    }
  }
}
