import { Hashtable } from './structure';

export class MultivestError extends Error {
    public status: number;
    constructor(public message: string, status: number = 500) {
        super(message);
        this.status = status
    }
}
