export abstract class Dao<T> {
    abstract getId(): string;
    abstract get(obj: Partial<T>): Promise<T>;
    abstract list(obj: Partial<T>): Promise<T[]>;
    abstract update(obj: Partial<T>): Promise<any>;
    abstract create(obj: T): Promise<any>;
    abstract remove(obj: Partial<T>): Promise<any>; 
}