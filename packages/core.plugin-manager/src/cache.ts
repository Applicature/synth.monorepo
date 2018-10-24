export class Cache<T> {
    // @ts-ignore
    private value: T;
    // @ts-ignore
    private time: number;

    public getValue(): T {
        return this.value;
    }

    public setValue(value: T) {
        this.value = value;
        this.time = Date.now();
    }

    public isExpired(expiresIn: number = 300000) {
        if (!this.time) {
            return true;
        }
        const now = Date.now();
        return now > this.time + expiresIn;
    }
}
