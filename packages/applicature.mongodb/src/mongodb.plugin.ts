/**
 * Based on:
 * https://github.com/vadimdemedes/mongorito/blob/master/lib/database.js
 */

import { Db, MongoClientOptions, connect } from 'mongodb';
import * as logger from 'winston';
import * as config from 'config';
import { ConnectionState } from './model';
import { MongoDBDao } from './mongodb.dao';
import { Constructable, Dao, Plugin, PluginManager, MultivestError, Hashtable } from '@applicature/multivest.core';

export class MongodbPlugin extends Plugin<any> {
    private urls: string;
    private options: MongoClientOptions;
    private connection: Db;
    private connectionPromise: Promise<Db>;
    public state: ConnectionState = ConnectionState.Disconnected;

    constructor(pluginManager: PluginManager) {
        super(pluginManager);

        this.urls = config.get('multivest.mongodb.url');

        const options = config.get('multivest.mongodb.options') as MongoClientOptions;

        if (options) {
            this.options = options;
        }
        else {
            this.options = {
                reconnectTries: 10,
                autoReconnect: true
            };
        }
    }

    getPluginId() {
        return 'mongodb';
    }

    async init() {
        if (this.connection) {
            return Promise.resolve(this.connection);
        }

        this.state = ConnectionState.Connecting;
        this.connectionPromise = connect(this.urls, this.options);
        try {
            this.connection = await this.connectionPromise;
            this.invoke();
        }
        catch (err) {
            logger.error('Failed to connect to mongodb: ', err);
            process.exit(1);
        }

        return this.connectionPromise;
    }

    addDao(DaoConstructor: Constructable<MongoDBDao<any>>) {
        if (this.state === ConnectionState.Connected) {
            const instance = new DaoConstructor(this.connection);

            this.daos[instance.getDaoId()] = instance;
        }
        else {
            this.registerDao(DaoConstructor as typeof Dao);
        }
    }

    getDB() {
        if (this.state === ConnectionState.Disconnected) {
            return Promise.reject(new Error('Database is disconnected.'));
        }

        if (this.state === ConnectionState.Connected) {
            return Promise.resolve(this.connection);
        }

        if (this.state === ConnectionState.Connecting) {
            return this.connectionPromise;
        }

        throw new MultivestError('Unrsolved state');
    }

    getDao() {
        if (this.state === ConnectionState.Disconnected) {
            return Promise.reject(new Error('Database is disconnected.'));
        }
        else if (this.state === ConnectionState.Connected) {
            return Promise.resolve(this.daos);
        }
        else if (this.state === ConnectionState.Connecting) {
            return this.connectionPromise
                .then(() => this.daos);
        }

        throw new MultivestError('Unrsolved state');
    }

    disconnect() {
        return this.getDB()
            .then((db) => {
                db.close();
                this.state = ConnectionState.Disconnected;
            });
    }

    isConnected() {
        return this.state === ConnectionState.Connected;
    }
}
