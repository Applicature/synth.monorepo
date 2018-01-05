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

    abstract async sendTransaction(txData: Transaction): Promise<void>;

    abstract async sendRawTransaction(txHex: string): Promise<void>;

    abstract async getBalance(address: string, minConf: number): Promise<BigNumber>;

    abstract getBlockNumber(block: Block): number;

    abstract getBlockTimestamp(block: Block): number;
}
