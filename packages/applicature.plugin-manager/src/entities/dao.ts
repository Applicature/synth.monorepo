export abstract class Dao<T = void> {
    public abstract getDaoId(): string;
    public abstract get(needle: Partial<T>): Promise<T>;
    public abstract list(needle: Partial<T>): Promise<Array<T>>;
    public abstract update(needle: Partial<T>, substitution: Partial<T>): Promise<T>;
    public abstract create(needle: Partial<T>): Promise<T>;
    public abstract fill(needle: Array<Partial<T>>): Promise<Array<T>>;
    public abstract remove(needle: Partial<T>): Promise<T>;
}
