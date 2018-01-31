import { Hashtable } from './structure';

export class MultivestError extends Error {
    constructor(public message: string) {
        super(message);
    }
}
