import { BigNumber } from 'bignumber.js';
import { Hashtable } from '../structure';

export interface Contribution {
    blockchain: string;
    symbol: string;
    txHash: string;
    amount: BigNumber;
    params: Hashtable<any>;
    userAddress: string;
}

export interface ExternalContribution extends Contribution {
    icoAddressId: string;
    parentTxHash: string;
}
