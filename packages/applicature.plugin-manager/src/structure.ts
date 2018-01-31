export interface Hashtable<T> {
    [key: string]: T;
}

export interface Constructable<T> {
    new(...args: Array<any>): T;
}
