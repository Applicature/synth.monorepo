import { Constructable } from './system';

export abstract class Dao<T> {
    abstract getDaoId(): string;
    abstract get(needle: Partial<T>): Promise<T>;
    abstract list(needle: Partial<T>): Promise<T[]>;
    abstract update(needle: Partial<T>, substitution: Partial<T>): Promise<Partial<T>>;
    abstract create(needle: Partial<T>): Promise<Partial<T>>;
    abstract remove(needle: Partial<T>): Promise<Partial<T>>; 
}