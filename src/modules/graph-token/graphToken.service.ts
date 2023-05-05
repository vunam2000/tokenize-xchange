import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import { Cache } from 'cache-manager';
import { CrawlDataService } from '../crawl-data/crawlData.service';
import { GraphEdge } from './graph';

@Injectable()
export class GraphTokenService {
  private graphEdges: GraphEdge[];

  constructor(private readonly crawlDataService: CrawlDataService) {
    this.graphEdges = [];
  }

  async getBookTickerOfTokenPair(tokenPair: string) {
    return await this.crawlDataService.getDataFromCache(tokenPair);
  }

  async updateGraphEdge(tokenPair: string[]) {
    const symbol = tokenPair[0] + tokenPair[1];
    const data = await this.crawlDataService.getDataFromCache(symbol);

    if (!data) {
      return;
    }
    const { bestAsk, bestAskQnt, bestBid, bestBidQnt } = data;

    let edgeBid = this.graphEdges.filter(
      (edge) =>
        edge.fromToken === tokenPair[0] && edge.toToken === tokenPair[1],
    )?.[0];
    if (!edgeBid) {
      edgeBid = new GraphEdge(tokenPair[0], tokenPair[1], 'bid');
      this.graphEdges.push(edgeBid);
    }

    // Update edgeBid
    edgeBid.setBestPrice(bestBid);
    edgeBid.setBestQnt(bestBidQnt);

    let edgeAsk = this.graphEdges.filter(
      (edge) =>
        edge.fromToken === tokenPair[1] && edge.toToken === tokenPair[0],
    )?.[0];
    if (!edgeAsk) {
      edgeAsk = new GraphEdge(tokenPair[1], tokenPair[0], 'ask');
      this.graphEdges.push(edgeAsk);
    }

    // Update edgeAsk
    edgeAsk.setBestPrice(bestAsk);
    edgeAsk.setBestQnt(bestAskQnt);
  }

  async detectTriangleArbitrage(triangleArbitrage: string[]) {
    const firstToken = triangleArbitrage[0];
    const secondToken = triangleArbitrage[1];
    const thirdToken = triangleArbitrage[2];

    const bestFromFirstToSecond = this.graphEdges.filter(
      (edge) => edge.fromToken === firstToken && edge.toToken === secondToken,
    )?.[0];
    if (!bestFromFirstToSecond) {
      return;
    }

    const bestFromSecondToThird = this.graphEdges.filter(
      (edge) => edge.fromToken === secondToken && edge.toToken === thirdToken,
    )?.[0];
    if (!bestFromSecondToThird) {
      return;
    }

    const bestFromThirdToFirst = this.graphEdges.filter(
      (edge) => edge.fromToken === thirdToken && edge.toToken === firstToken,
    )?.[0];
    if (!bestFromThirdToFirst) {
      return;
    }

    const firstTokenQnt = 1;
    const secondTokenQnt = bestFromFirstToSecond.calculateQnt(firstTokenQnt);
    const thirdTokenQnt = bestFromSecondToThird.calculateQnt(secondTokenQnt);
    const firstTokenQntAfter = bestFromThirdToFirst.calculateQnt(thirdTokenQnt);

    const profitRate = firstTokenQntAfter / firstTokenQnt;
    console.log(
      'Traverse: ',
      triangleArbitrage,
      profitRate,
      firstTokenQnt,
      secondTokenQnt,
      thirdTokenQnt,
    );
    if (profitRate > 1) {
      console.log('Triangle Arbitrage detected: ', triangleArbitrage);
      console.log('Profit rate: ', profitRate);
    }
  }
}
