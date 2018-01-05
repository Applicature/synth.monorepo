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