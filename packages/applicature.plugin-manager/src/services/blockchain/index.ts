import { BigNumber } from 'bignumber.js';
import { Block, Transaction } from '../../structure';

export abstract class BlockchainService {
    abstract getBlockchainId(): string;

    abstract getSymbol(): string;

    abstract getHDAddress(index: number): string;

    abstract isValidAddress(address: string): boolean;

    abstract async getBlockHeight(): Promise<number>;

    abstract async getBlockByHeight(blockHeight: number): Promise<Block>;

    abstract async getTransactionByHash(txHash: string): Promise<Transaction>;

    abstract async sendTransaction(txData: Transaction): Promise<string>;

    abstract async sendRawTransaction(txHex: string): Promise<string>;

    abstract async getBalance(address: string, minConf: number): Promise<BigNumber>;
}
