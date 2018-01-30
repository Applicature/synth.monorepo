import { BigNumber } from 'bignumber.js';

export interface Transaction {
    hash: string;
    blockHash?: string;
    blockHeight?: number;
    blockTime?: number;
    fee: BigNumber;
    from: Array<Sender>;
    to: Array<Recipient>;
}

export interface Sender {
    address: string;
}

export interface Recipient {
    address: string;
    amount: BigNumber;
}
