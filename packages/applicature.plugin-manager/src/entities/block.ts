import { BigNumber } from 'bignumber.js';
import { Transaction } from './transaction';

export interface Block {
    height: number;
    hash: string;
    parentHash?: string;
    difficulty?: number;
    nonce: any;
    size: number;
    time: number;
    network: string;
    fee: BigNumber;
    transactions: Array<Transaction>;
}
