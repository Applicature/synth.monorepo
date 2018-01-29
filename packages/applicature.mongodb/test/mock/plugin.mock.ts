import { MongoClient } from 'mongo-mock';
import { Db } from 'mongodb';
import { Plugin as MongodbPlugin } from '../../src/mongodb.plugin';

export class MongodbPluginMock extends MongodbPlugin {
    public async initConnection() {
        return MongoClient.connect(this.urls, this.options);
    }
}
