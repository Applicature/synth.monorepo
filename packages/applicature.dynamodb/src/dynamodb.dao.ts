import { Dao } from '@applicature-private/multivest.core';
import { DataMapper } from '@aws/dynamodb-data-mapper';
import { DynamoDB } from 'aws-sdk';
import serialize from './utils';

export abstract class DynamoDBDao<T> extends Dao<T> {
  protected connection: DynamoDB.DocumentClient;
  protected schema: DataMapper;

  constructor(db: DataMapper) {
    super();

    this.schema = db;
  }

  public create(needle: Partial<T>): Promise<any> {
    return new Promise((resolve, reject) => {
      return this.schema
        .put(serialize(needle))
        .then((value: any) => resolve(value))
        .catch((err: any) => reject(err));
    });
  }

  public async fill(needle: Array<Partial<T>>): Promise<Array<T>> {
    const iterator = this.schema.batchPut(serialize(needle));
    const products = await this.proccessAsyncIterator(iterator);

    return Promise.all(products);
  }

  public get(query: Partial<T>): Promise<any> {
    return new Promise((resolve, reject) => {
      return this.schema
        .get(serialize(query))
        .then((value: any) => resolve(value))
        .catch((err: any) => reject(err));
    });
  }

  public async update(needle: Partial<T>): Promise<any> {
    return new Promise((resolve, reject) => {
      return this.schema
        .update(serialize(needle))
        .then((value: any) => resolve(value))
        .catch((err: any) => reject(err));
    });
  }

  public async list(needle: Array<Partial<T>> | Partial<T>): Promise<Array<T>> {
    const iterator = this.schema.batchGet(serialize(needle));
    const products = await this.proccessAsyncIterator(iterator);

    return Promise.all(products);
  }

  public async remove(needle: Partial<T>): Promise<any> {
    return new Promise((resolve, reject) => {
      return this.schema
        .delete(serialize(needle))
        .then((value: any) => resolve(value))
        .catch((err: any) => reject(err));
    });
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
}
