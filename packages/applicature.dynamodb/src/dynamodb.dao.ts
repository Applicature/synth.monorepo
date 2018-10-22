import { Dao } from '@applicature-private/multivest.core';
import { DataMapper } from '@aws/dynamodb-data-mapper';
import { DynamoDB } from 'aws-sdk';

export abstract class DynamoDBDao<T> extends Dao<T> {
    protected connection: DynamoDB.DocumentClient;
    protected schema: DataMapper;

    constructor(db: DataMapper) {
        super();

        this.schema = db;
    }

    public standart(data: object | Array<any>) {
        if (Array.isArray(data) && data.length >= 1) {
            return data.map((current) => Object.assign(this.getMapper(), current));
        }
        return Object.assign(this.getMapper(), data);
    }

    public create(needle: Partial<T>): Promise<any> {
        return this.schema.put(this.standart(needle));
    }

    public async fill(needle: Array<Partial<T>>): Promise<Array<T>> {
        const iterator = this.schema.batchPut(this.standart(needle));
        const products = await this.proccessAsyncIterator(iterator);

        return Promise.all(products);
    }

    public get(query: Partial<T>): Promise<any> {
        return this.schema.get(this.standart(query));
    }

    public async update(needle: Partial<T>): Promise<any> {
        return this.schema.update(this.standart(needle));
    }

    public async list(needle: Array<Partial<T>> | Partial<T>): Promise<Array<T>> {
        const iterator = this.schema.batchGet(this.standart(needle));
        const products = await this.proccessAsyncIterator(iterator);

        return Promise.all(products);
    }

    public async remove(needle: Partial<T>): Promise<any> {
        return this.schema.delete(this.standart(needle));
    }

    public async proccessAsyncIterator(asyncIterable: any, count = Infinity) {
        const result = [];
        const iterator = asyncIterable[Symbol.asyncIterator]();

        while (result.length < count) {
            const { value, done } = await iterator.next();
            if (done) break;
            result.push(value);
        }

        return result;
    }

    public abstract getDefaultValue(): T;
    protected abstract getMapper(): any;
}
