import { Dao, Hashtable } from '@applicature/multivest.core';
import { Collection, Db } from 'mongodb';
import { v1 as generateId } from 'uuid';
import {parseDecimals} from './utils';

export abstract class MongoDBDao<T> extends Dao<T> {
    /*
    @deprecated use `action`Raw methods instead
    */
    public static parseDecimals(type: 'toMongo' | 'fromMongo', data: any): any {
        return parseDecimals(type, data);
    }

    protected collection: Collection<T>;

    constructor(db: Db) {
        super();
        this.collection = db.collection<T>(this.getCollectionName());
    }

    public create(needle: Partial<T>): Promise<T> {
        const fulfilled = Object.assign(this.getDefaultValue(), needle);

        const parsed = parseDecimals('toMongo', fulfilled);

        if (!Object.prototype.hasOwnProperty.call(parsed, 'id')) {
            parsed.id = generateId();
        }

        return this.collection
            .insertOne(parsed)
            .then<T>((result: any) => parseDecimals('fromMongo', result.ops[0]));
    }

    public fill(needle: Array<Partial<T>>) {
        const parsed = parseDecimals('toMongo', needle);

        return this.collection
            .insertMany(parsed)
            .then<Array<T>>((result: any) => parseDecimals('fromMongo', result.ops));
    }

    /*
    @deprecated use getRaw instead
     */
    public get(needle: Partial<T>) {
        const parsed = parseDecimals('toMongo', needle);

        return this.collection
            .findOne(parsed)
            .then((item: any) => parseDecimals('fromMongo', item) as T);
    }

    public getRaw(query: Hashtable<any>) {
        const parsed = parseDecimals('toMongo', query);

        return this.collection
            .findOne(parsed)
            .then((item: any) => parseDecimals('fromMongo', item) as T);
    }

    /*
    @deprecated use updateRaw instead
     */
    public update(needle: Partial<T>, substitution: Partial<T>) {
        const parsedNeedle = parseDecimals('toMongo', needle);

        const parsedSubstitution = parseDecimals('toMongo', substitution);

        return this.collection
            .updateMany(parsedNeedle, {$set: parsedSubstitution})
            .then(() => needle);
    }

    public updateRaw(query: Hashtable<any>, update: Hashtable<any>) {
        const parsedQuery = parseDecimals('toMongo', query);

        const parsedUpdate = parseDecimals('toMongo', update);

        return this.collection
            .updateMany(parsedQuery, parsedUpdate)
            .then(() => query);
    }

    /*
    @deprecated use listRaw instead
     */
    public list(needle: Partial<T>) {
        const parsed = parseDecimals('toMongo', needle);

        return this.collection
            .find(parsed)
            .toArray()
            .then((list: any) => parseDecimals('fromMongo', list) as Array<T>);
    }

    public listRaw(query: Hashtable<any>) {
        const parsed = parseDecimals('toMongo', query);

        return this.collection
            .find(parsed)
            .toArray()
            .then((list: any) => parseDecimals('fromMongo', list) as Array<T>);
    }

    /*
    @deprecated use removeRaw instead
    */
    public remove(needle: Partial<T>) {
        const parsed = parseDecimals('toMongo', needle);

        return this.collection
            .deleteMany(parsed)
            .then(() => needle);
    }

    public removeRaw(query: Hashtable<any>) {
        const parsed = parseDecimals('toMongo', query);

        return this.collection
            .deleteMany(parsed)
            .then(() => ({}));
    }

    /*
    @deprecated use aggregateRaw instead
    */
    public aggregate(aggregateQuery: any): Promise<Array<any>> {
        return this.collection
            .aggregate(aggregateQuery, {allowDiskUse: true})
            .toArray()
            .then((list: any) => parseDecimals('fromMongo', list) as Array<T>);
    }

    public aggregateRaw(aggregateQuery: Array<any>): Promise<Array<any>> {
        return this.collection
            .aggregate(aggregateQuery, {allowDiskUse: true})
            .toArray()
            .then((list: any) => parseDecimals('fromMongo', list) as Array<T>);
    }

    public abstract getDaoId(): string;

    public abstract getCollectionName(): string;

    public abstract getDefaultValue(): T;
}
