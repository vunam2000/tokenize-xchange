import {
  CACHE_MANAGER,
  Controller,
  Get,
  Inject,
  Injectable,
  Param,
  Post,
} from '@nestjs/common';
import { Cache } from 'cache-manager';
import { GraphTokenService } from './graphToken.service';

@Controller('graph-token')
export class GraphTokenController {
  constructor(private readonly graphTokenService: GraphTokenService) {}

  @Get('/book-ticker/:tokenPair')
  async getBookTickerOfTokenPair(@Param() params) {
    const { tokenPair } = params;
    const bookTicker = await this.graphTokenService.getBookTickerOfTokenPair(
      tokenPair,
    );

    return bookTicker;
  }

  @Post('/book-ticker/:tokenPair')
  async createBookTickerOfTokenPair(@Param() params) {
    const { tokenPair } = params;
    const bookTicker = await this.graphTokenService.createBookTickerOfTokenPair(
      tokenPair,
    );

    return bookTicker;
  }
}
