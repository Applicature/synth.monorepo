import { Transaction as BlockchainTransaction } from './transaction';
import { Contribution as BlockchainContribution } from './contribution';

export namespace Scheme {

    export interface Job {
        jobId: string;
        [key: string]: any;
    }

    export interface Contribution {
        _id: number;
        ref: Partial<BlockchainContribution>;
        uniqId: string;
        status: ContributionStatus;        
    }

    export enum ContributionStatus {
        Processing = 'PROCESSED',
        Processed = 'PROCESSING'
    }
    
    export interface Transaction {
        _id: number;
        ref: Partial<BlockchainTransaction>;
        uniqId: string;
        status: TransactionStatus; 
    }
    
    export enum TransactionStatus {
        Created = 'CREATED',
        Sent = 'SENT',
        Mined = 'MINED'
    }
    
}