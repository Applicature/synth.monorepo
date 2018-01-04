import { BigNumber } from 'bignumber.js'; 

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

export interface Transaction {
    hash: string;
    blockHash?: string;
    blockHeight?: number;
    fee: number;
    from: Sender[];
    to: Recipient[];
}

export interface Sender {
    address: string;
}

export interface Recipient {
    address: string;
    amount: number;
}