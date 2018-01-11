import { Collection, Db, InsertOneWriteOpResult, UpdateWriteOpResult, WriteOpResult } from 'mongodb';
import { Dao } from '@applicature/multivest.core';

export abstract class MongoDBDao<T> implements Dao<T> {
    private db: Db;
    protected collection: Collection<T>;

    constructor(db: Db) {
        this.db = db;
        this.collection = this.db.collection<T>(this.getCollectionName());
    }

    abstract getDaoId(): string;

    abstract getCollectionName(): string;

    abstract getDefaultValue(): T;

    create(needle: Partial<T>) {
        const fulfilled = Object.assign(this.getDefaultValue(), needle);
        return this.collection
            .insert(needle)
            .then(() => needle);
    }

    get(needle: Partial<T>) {
        return this.collection
            .findOne(needle);
    }

    list(needle: Partial<T>) {
        return this.collection
            .find(needle)
            .toArray();
    }

    update(needle: Partial<T>, substitution: Partial<T>) {
        return this.collection
            .updateMany(needle, substitution)
            .then(() => needle);
    }

    remove(needle: Partial<T>) {
        return this.collection
            .remove(needle)
            .then(() => needle);
    }
}
