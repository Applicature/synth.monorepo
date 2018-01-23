import { Dao } from '@applicature/multivest.core';
import { Collection, Db } from 'mongodb';

export abstract class MongoDBDao<T> implements Dao<T> {
    protected collection: Collection<T>;
    private db: Db;

    constructor(db: Db) {
        this.db = db;
        this.collection = this.db.collection<T>(this.getCollectionName());
    }

    public abstract getDaoId(): string;

    public abstract getCollectionName(): string;

    public abstract getDefaultValue(): T;

    public create(needle: Partial<T>) {
        const fulfilled = Object.assign(this.getDefaultValue(), needle);
        return this.collection
            .insertOne(needle)
            .then<T>((result) => result.ops[0]);
    }

    public fill(needle: Array<Partial<T>>) {
        return this.collection
            .insertMany(needle)
            .then<Array<T>>((result) => result.ops);
    }

    public get(needle: Partial<T>) {
        return this.collection
            .findOne(needle);
    }

    public list(needle: Partial<T>) {
        return this.collection
            .find(needle)
            .toArray();
    }

    public update(needle: Partial<T>, substitution: Partial<T> | {$set: Partial<T>}) {
        return this.collection
            .updateMany(needle, substitution)
            .then(() => needle);
    }

    public remove(needle: Partial<T>) {
        return this.collection
            .remove(needle)
            .then(() => needle);
    }
}
