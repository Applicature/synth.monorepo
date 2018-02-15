import { Dao, Hashtable } from '@applicature/multivest.core';
import { BigNumber } from 'bignumber.js';
import { Collection, Db, Decimal128 } from 'mongodb';

export abstract class MongoDBDao<T> extends Dao<T> {

    public static parseDecimals(type: 'toMongo' | 'fromMongo', data: any): any {
        if (typeof data !== 'object') {
            return data;
        }

        if (Array.isArray(data)) {
            return data.map((item) => MongoDBDao.parseDecimals(type, item));
        }

        if (type === 'toMongo' && data instanceof BigNumber) {
            return Decimal128.fromString(data.toString());
        }

        if (type === 'fromMongo' && data instanceof Decimal128) {
            return new BigNumber(data.toString());
        }

        const keys = Object.keys(data);

        return keys.reduce((prev, curr) => {
                prev[curr] = MongoDBDao.parseDecimals(type, data[curr]);
                return prev;
            },
            {} as Hashtable<any>
        );
    }

    protected collection: Collection<T>;

    constructor(db: Db) {
        super();
        this.collection = db.collection<T>(this.getCollectionName());
    }

    protected abstract getDaoId(): string;

    protected abstract getCollectionName(): string;

    protected abstract getDefaultValue(): T;

    protected create(needle: Partial<T>) {
        const fulfilled = Object.assign(this.getDefaultValue(), needle);
        const parsed = MongoDBDao.parseDecimals('toMongo', fulfilled);
        return this.collection
            .insertOne(parsed)
            .then<T>((result) => result.ops[0]);
    }

    protected fill(needle: Array<Partial<T>>) {
        const parsed = MongoDBDao.parseDecimals('toMongo', needle);
        return this.collection
            .insertMany(parsed)
            .then<Array<T>>((result) => result.ops);
    }

    protected get(needle: Partial<T>) {
        return this.collection
            .findOne(needle)
            .then((item) => MongoDBDao.parseDecimals('fromMongo', item) as T);
    }

    protected list(needle: Partial<T>) {
        return this.collection
            .find(needle)
            .toArray()
            .then((list) => MongoDBDao.parseDecimals('fromMongo', list) as Array<T>);
    }

    protected update(needle: Partial<T>, substitution: Partial<T>) {
        const parsed = MongoDBDao.parseDecimals('toMongo', substitution);
        return this.collection
            .updateMany(needle, { $set: parsed })
            .then(() => needle);
    }

    protected remove(needle: Partial<T>) {
        return this.collection
            .deleteMany(needle)
            .then(() => needle);
    }
}
