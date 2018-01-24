import { Dao, Hashtable } from '@applicature/multivest.core';
import { BigNumber } from 'bignumber.js';
import { Collection, Db, Decimal128 } from 'mongodb';

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
        const parsed = this.parseDecimals('toMongo', fulfilled);
        return this.collection
            .insertOne(parsed)
            .then<T>((result) => result.ops[0]);
    }

    public fill(needle: Array<Partial<T>>) {
        const parsed = this.parseDecimals('toMongo', needle);
        return this.collection
            .insertMany(parsed)
            .then<Array<T>>((result) => result.ops);
    }

    public get(needle: Partial<T>) {
        return this.collection
            .findOne(needle)
            .then((item) => this.parseDecimals('fromMongo', item) as T);
    }

    public list(needle: Partial<T>) {
        return this.collection
            .find(needle)
            .toArray()
            .then((list) => this.parseDecimals('fromMongo', list) as Array<T>);
    }

    public update(needle: Partial<T>, substitution: Partial<T>) {
        const parsed = this.parseDecimals('toMongo', substitution);
        return this.collection
            .updateMany(needle, { $set: parsed })
            .then(() => needle);
    }

    public remove(needle: Partial<T>) {
        return this.collection
            .deleteMany(needle)
            .then(() => needle);
    }

    public parseDecimals(type: 'toMongo' | 'fromMongo', data: any): any {
        if (typeof data !== 'object') {
            return data;
        }

        if (Array.isArray(data)) {
            return data.map((item) => this.parseDecimals(type, item));
        }

        if (type === 'toMongo' && data instanceof BigNumber) {
            return Decimal128.fromString(data.toString());
        }

        if (type === 'fromMongo' && data instanceof Decimal128) {
            return new BigNumber(data.toString());
        }

        const keys = Object.keys(data);

        if (keys.length) {
            return keys.reduce((prev, curr) => {
                prev[curr] = this.parseDecimals(type, data[curr]);
                return prev;
            },
            {} as Hashtable<any>);
        }
    }
}
