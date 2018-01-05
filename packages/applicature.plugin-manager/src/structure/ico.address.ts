import { Transaction } from './transaction';

export interface Funds {
    total: number;
    txs: Transaction[];
}

export interface IcoAddress {
        network: string;
        address: string;
        userId: number;
        derivedIndex: number;
        forNetwork: string;
        forAddress: string;
        collected: Funds,
        refunded: Funds,
        createdAt: Date
}