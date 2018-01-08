/**
 * Based on:
 * https://github.com/vadimdemedes/mongorito/blob/master/lib/database.js
 */

import { Db, MongoClientOptions, connect } from 'mongodb';
import * as logger from 'winston';
import * as config from 'config';
import { ConnectionState } from './model';
import { MongoDBDao } from './mongodb.dao';
import { Dao, CompositeDao, Plugin, PluginManager, MultivestError, Hashtable } from '@applicature/multivest.core';

export class MongodbPlugin<T extends CompositeDao<T>> extends Plugin<T> {
    private urls: string;
    private options: MongoClientOptions;
    private connection: Db;
    private connectionPromise: Promise<Db>;
    public state: ConnectionState = ConnectionState.Disconnected;

    public dao: Hashtable<MongoDBDao<T>> = {};
    public daoClasses: Array<typeof MongoDBDao> = [];

    constructor(pluginManager: PluginManager) {
        super(pluginManager, 'mongodb');

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

    async init() {
        if (this.connection) {
            return Promise.resolve(this.connection);
        }

        this.state = ConnectionState.Connecting;
        this.connectionPromise = connect(this.urls, this.options);
        try {
            this.connection = await this.connectionPromise;

            for (const DaoConstructor of this.daoClasses) {
                const instance = new DaoConstructor(this.connection);

                this.dao[instance.getDaoId()] = instance;
            }
        }
        catch (err) {
            logger.error('Failed to connect to mongodb: ', err);
            process.exit(1);
        }

        return this.connectionPromise;
    }

    addDao(DaoConstructor: typeof MongoDBDao) {
        if (this.state === ConnectionState.Connected) {
            const instance = new DaoConstructor(this.connection);

            this.dao[instance.getDaoId()] = instance;
        }
        else {
            this.daoClasses.push(DaoConstructor);
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
            return Promise.resolve(this.dao);
        }
        else if (this.state === ConnectionState.Connecting) {
            return this.connectionPromise
                .then(() => this.dao);
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
