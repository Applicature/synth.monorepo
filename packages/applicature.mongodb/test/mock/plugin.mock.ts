import { MongoClient } from 'mongo-mock';
import {connect, Db} from 'mongodb';
import { Plugin as MongodbPlugin } from '../../src/mongodb.plugin';

export class MongodbPluginMock extends MongodbPlugin {
    // public async initConnection() {
    //     return MongoClient.connect(this.urls, this.options);
    // }

    protected async initConnection() {
        this.client = {
            close: () => {

            }
        };

        if (!this.dbName) {
            this.dbName = 'test';
        }

        const db = await MongoClient.connect(this.urls, this.options);

        return db;
    }
}
