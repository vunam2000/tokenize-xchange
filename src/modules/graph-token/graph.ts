export class GraphEdge {
  private bestPrice: string;
  private bestQnt: string;

  constructor(
    public fromToken: string,
    public toToken: string,
    public type: 'ask' | 'bid',
  ) {}

  setBestPrice(value: string) {
    this.bestPrice = value;
  }

  setBestQnt(value: string) {
    this.bestQnt = value;
  }

  getBestPrice() {
    return this.bestPrice;
  }

  getBestQnt() {
    return this.bestQnt;
  }

  calculateQnt(value: number) {
    if (this.type === 'ask') {
      return this.calculateAskQnt(value);
    } else if (this.type === 'bid') {
      return this.calculateBidQnt(value);
    }
  }

  calculateAskQnt(value: number) {
    return value / Number(this.bestPrice);
  }

  calculateBidQnt(value: number) {
    return value * Number(this.bestPrice);
  }
}
