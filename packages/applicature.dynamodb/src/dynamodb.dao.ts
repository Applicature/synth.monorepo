import { Dao } from '@applicature-private/multivest.core';
import { DynamoDB } from 'aws-sdk';
import { DataMapper } from '@aws/dynamodb-data-mapper';

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
        .put(needle)
        .then((value: any) => resolve(value))
        .catch((err: any) => reject(err));
    });
  }

  public async fill(needle: Array<Partial<T>>): Promise<Array<T>> {
    const iterator = this.schema.batchPut(needle);
    const products = await this.proccessAsyncIterator(iterator);

    return Promise.all(products);
  }

  public get(query: Partial<T>): Promise<any> {
    return new Promise((resolve, reject) => {
      return this.schema
        .get(query)
        .then((value: any) => resolve(value))
        .catch((err: any) => reject(err));
    });
  }

  public async update(needle: Partial<T>): Promise<any> {
    return new Promise((resolve, reject) => {
      return this.schema
        .update(needle)
        .then((value: any) => resolve(value))
        .catch((err: any) => reject(err));
    });
  }

  public async listGet(needle: Array<Partial<T>>): Promise<Array<T>> {
    const iterator = this.schema.batchGet(needle);
    const products = await this.proccessAsyncIterator(iterator);

    return Promise.all(products);
  }

  public async remove(needle: Partial<T>): Promise<any> {
    return new Promise((resolve, reject) => {
      return this.schema
        .delete(needle)
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
