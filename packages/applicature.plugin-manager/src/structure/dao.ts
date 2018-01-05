export abstract class Dao<T> {
    abstract getId(): string;
    abstract get(needle: Partial<T>): Promise<T>;
    abstract list(needle: Partial<T>): Promise<T[]>;
    abstract update(needle: Partial<T>, substitution: Partial<T>): Promise<any>;
    abstract create(needle: T): Promise<any>;
    abstract remove(needle: Partial<T>): Promise<any>; 
}