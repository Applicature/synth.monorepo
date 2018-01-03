import { Hashtable } from './structure';

export class MultivestError extends Error {
    constructor(public message: string, public params?: Hashtable<any>) {
        super(message);
    }
}
