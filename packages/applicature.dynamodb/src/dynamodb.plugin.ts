import { Plugin, PluginManager } from '@applicature-private/multivest.core';
import * as config from 'config';
import * as logger from 'winston';
import { DaoModelOptions, DynamoWrapperClient } from './dynamo.client';

class DynamodbPlugin extends Plugin<any> {
    protected connection: any;
    protected connectionPromise: any;
    protected options: object;
    protected daoOptions: DaoModelOptions;

    constructor(pluginManager: PluginManager, daoOptions: DaoModelOptions) {
        super(pluginManager);

        this.options = config.get('multivest.dynamodb');
        this.daoOptions = daoOptions;
    }

    public getPluginId() {
        return 'dynamodb';
    }

    public async init() {
        if (this.connection) {
            return this.connection;
        }
        this.connectionPromise = this.initConnection(this.daoOptions);
        try {
            this.connection = await this.connectionPromise;
        } catch (err) {
            logger.error('Failed to connect to dynamodb: ', err);
            throw err;
        }
        return this.connection;
    }

    protected initConnection(daoOptions: DaoModelOptions) {
        const instance = new DynamoWrapperClient(this.options);
        return instance.setDaoModel(daoOptions);
    }
}

export { DynamodbPlugin as Plugin };
