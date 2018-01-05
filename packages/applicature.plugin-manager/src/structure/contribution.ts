export interface Contribution {
    uniqId: number; 
    txHash: string; 
    amount: number; 
    params: string;
}

export interface ExternalContribution {
    uniqId: number;
    parentTx: string; 
    icoAddressId: string; 
    userAddress: string; 
    tokens: string; 
    status: string; 
    at: number;
}