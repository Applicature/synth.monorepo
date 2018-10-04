import {
  Constructable,
  Dao,
  MultivestError,
  Plugin,
  PluginManager
} from '@applicature-private/multivest.core';
import * as config from 'config';
import * as logger from 'winston';
import { Errors } from './errors';
import { DynamoDBDao } from './dynamodb.dao';
import { DynamoWrapperClient } from '../@types/dynamodb-wrapper';

class DynamodbPlugin extends Plugin<any> {
  protected connection: any;
  protected connectionPromise: any;
  protected options: object;

  constructor(pluginManager: PluginManager) {
    super(pluginManager);

    this.options = config.get('multivest.dynamodb');
  }

  public getPluginId() {
    return 'dynamodb';
  }

  public async init() {
    if (this.connection) {
      return this.connection;
    }
    this.connectionPromise = this.initConnection();
    try {
      this.connection = await this.connectionPromise;
    } catch (err) {
      logger.error('Failed to connect to dynamodb: ', err);
      throw err;
    }
    return this.connection;
  }

  public addDao(DaoConstructor: Constructable<DynamoDBDao<any>>) {
    const instance = new DaoConstructor(this.connection);

    this.daos[instance.getDaoId()] = instance;
  }

  public getDaos() {
    return this.connection
      .get({
        TableName: 'table',
        Key: {}
      })
      .promise()
      .then(() => this.daos);
  }

  public async getDao(daoId: string) {
    const daos = await this.getDaos();
    if (!daos[daoId]) {
      throw new MultivestError(Errors.DAO_NOT_FOUND);
    }
    return daos[daoId];
  }

  protected initConnection() {
    const instance = new DynamoWrapperClient(config.get('multivest.dynamodb'));
    return instance.setDaoModel();
  }

  protected invokeDao(DaoConstructor: Constructable<Dao<any>>) {
    return new DaoConstructor(this.connection);
  }
}

export { DynamodbPlugin as Plugin };
