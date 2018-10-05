import { Plugin, PluginManager } from '@applicature-private/multivest.core';
import * as logger from 'winston';
import { DynamoWrapperClient } from './dynamoClient';

class DynamodbPlugin extends Plugin<any> {
  protected connection: any;
  protected connectionPromise: any;
  protected options: any;

  constructor(pluginManager: PluginManager) {
    super(pluginManager);

    this.options = {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      region: process.env.region || 'us-east-2',
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
    };
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

  protected initConnection() {
    const instance = new DynamoWrapperClient(this.options);
    return instance.setDaoModel();
  }
}

export { DynamodbPlugin as Plugin };
