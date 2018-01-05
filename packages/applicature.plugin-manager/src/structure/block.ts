import { BigNumber } from 'bignumber.js'; 
import { Transaction } from './transaction';

export interface Block {
    height: number;
    hash: string;
    parentHash?: string;
    difficulty?: number;
    nonce: any;
    size: number;
    time: Date;
    network: string;
    fee: BigNumber;
    transactions: Transaction[];
}

export interface BitcoinBlock extends Block {

}

export interface EthereumBlock extends Block {

}