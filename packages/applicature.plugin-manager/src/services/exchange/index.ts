export abstract class ExchangeServise {
    abstract getRate(value: number, from: string, to: string): number;
}
