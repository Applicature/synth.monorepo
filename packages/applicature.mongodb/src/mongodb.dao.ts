import { Dao, Hashtable } from '@applicature/multivest.core';
import { BigNumber } from 'bignumber.js';
import { Collection, Db, Decimal128, ObjectID } from 'mongodb';

export abstract class MongoDBDao<T> extends Dao<T> {

    public static parseDecimals(type: 'toMongo' | 'fromMongo', data: any): any {
        if (typeof data !== 'object' || !data) {
            return data;
        }

        if (type === 'fromMongo' && data instanceof ObjectID) {
            return data.toString();
        }

        if (data instanceof Date) {
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

    public abstract getDaoId(): string;

    public abstract getCollectionName(): string;

    public abstract getDefaultValue(): T;

    public create(needle: Partial<T>) {
        const fulfilled = Object.assign(this.getDefaultValue(), needle);
        const parsed = MongoDBDao.parseDecimals('toMongo', fulfilled);
        return this.collection
            .insertOne(parsed)
            .then<T>((result) => result.ops[0]);
    }

    public fill(needle: Array<Partial<T>>) {
        const parsed = MongoDBDao.parseDecimals('toMongo', needle);
        return this.collection
            .insertMany(parsed)
            .then<Array<T>>((result) => result.ops);
    }

    public get(needle: Partial<T>) {
        return this.collection
            .findOne(needle)
            .then((item) => MongoDBDao.parseDecimals('fromMongo', item) as T);
    }

    public list(needle: Partial<T>) {
        return this.collection
            .find(needle)
            .toArray()
            .then((list) => MongoDBDao.parseDecimals('fromMongo', list) as Array<T>);
    }

    public aggregate(aggregateQuery: any): Promise<Array<any>> {
        return this.collection
            .aggregate(aggregateQuery)
            .toArray()
            .then((list) => MongoDBDao.parseDecimals('fromMongo', list) as Array<T>);
    }

    public update(needle: Partial<T>, substitution: Partial<T>) {
        const parsed = MongoDBDao.parseDecimals('toMongo', substitution);
        return this.collection
            .updateMany(needle, { $set: parsed })
            .then(() => needle);
    }

    public remove(needle: Partial<T>) {
        return this.collection
            .deleteMany(needle)
            .then(() => needle);
    }
}
