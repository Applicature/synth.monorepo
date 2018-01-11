export interface Contribution {
    uniqId: string; 
    txHash: string; 
    amount: number; 
    params: string;
}

export interface ExternalContribution {
    uniqId: string;
    parentTx: string; 
    icoAddressId: string; 
    userAddress: string; 
    status: string; 
    at: number;
}