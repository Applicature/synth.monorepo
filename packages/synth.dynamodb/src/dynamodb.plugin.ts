import { Plugin, PluginManager } from '@applicature/synth.plugin-manager';
import * as config from 'config';
import * as logger from 'winston';
import { DynamoWrapperClient } from './dynamo.client';

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

    protected initConnection() {
        const instance = new DynamoWrapperClient(this.options);
        return instance.getMapper();
    }
}

export { DynamodbPlugin as Plugin };
