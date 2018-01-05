import { Contribution, ExternalContribution } from '../../structure';

export abstract class ICOServise {
    
    constructor(private symbol: string, private decimals: number) {}

    abstract isValidTxTime(time: number): boolean;

    abstract logContribution(contribution: Contribution): Promise<Contribution>;

    abstract handleExternalContribution(contribution: ExternalContribution): Promise<ExternalContribution>;

    abstract listContributions(address: string): Promise<Contribution[]>;

    abstract getStats(): void;

    getSymbol(): string {
        return this.symbol;
    }

    getDecimals(): number {
        return this.decimals;
    }
}