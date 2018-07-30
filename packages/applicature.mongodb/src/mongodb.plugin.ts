/**
 * Based on:
 * https://github.com/vadimdemedes/mongorito/blob/master/lib/database.js
 */

import {
    Constructable,
    Dao,
    MultivestError,
    Plugin,
    PluginManager
} from '@applicature-private/multivest.core';
import * as config from 'config';
import { connect, Db, MongoClientOptions } from 'mongodb';
import * as logger from 'winston';
import { Errors } from './errors';
import { ConnectionState } from './model';
import { MongoDBDao } from './mongodb.dao';

class MongodbPlugin extends Plugin<any> {
    public state: ConnectionState = ConnectionState.Disconnected;
    protected connection: Db;
    protected connectionPromise: Promise<Db>;
    protected urls: string;
    protected options: MongoClientOptions;

    constructor(pluginManager: PluginManager) {
        super(pluginManager);

        this.urls = config.get('multivest.mongodb.url');

        const options = config.get('multivest.mongodb.options') as MongoClientOptions;

        if (options) {
            this.options = options;
        }
        else {
            this.options = {
                autoReconnect: true,
                reconnectTries: 10,
            };
        }
    }

    public getPluginId() {
        return 'mongodb';
    }

    public async init() {
        if (this.connection) {
            return Promise.resolve(this.connection);
        }

        this.state = ConnectionState.Connecting;
        this.connectionPromise = this.initConnection();
        try {
            this.connection = await this.connectionPromise;
            this.state = ConnectionState.Connected;
        }
        catch (err) {
            logger.error('Failed to connect to mongodb: ', err);
            process.exit(1);
        }

        return this.connectionPromise;
    }

    public addDao(DaoConstructor: Constructable<MongoDBDao<any>>) {
        if (this.state === ConnectionState.Connected) {
            const instance = new DaoConstructor(this.connection);

            this.daos[instance.getDaoId()] = instance;
        }
        else {
            this.registerDao(DaoConstructor);
        }
    }

    public getDB() {
        if (this.state === ConnectionState.Disconnected) {
            return Promise.reject(new MultivestError(Errors.NO_CONNECTION));
        }

        if (this.state === ConnectionState.Connected) {
            return Promise.resolve(this.connection);
        }

        if (this.state === ConnectionState.Connecting) {
            return this.connectionPromise;
        }

        throw new MultivestError(Errors.UNRESOLVED_STATE);
    }

    public getDaos() {
        if (this.state === ConnectionState.Disconnected) {
            return Promise.reject(new MultivestError(Errors.NO_CONNECTION));
        }
        else if (this.state === ConnectionState.Connected) {
            return Promise.resolve(this.daos);
        }
        else if (this.state === ConnectionState.Connecting) {
            return this.connectionPromise
                .then(() => this.daos);
        }

        throw new MultivestError(Errors.UNRESOLVED_STATE);
    }

    public async getDao(daoId: string) {
        const daos = await this.getDaos();
        if (!daos[daoId]) {
            throw new MultivestError(Errors.DAO_NOT_FOUND);
        }
        return daos[daoId];
    }

    public disconnect() {
        return this.getDB()
            .then((db) => {
                db.close();
                this.state = ConnectionState.Disconnected;
            });
    }

    public isConnected() {
        return this.state === ConnectionState.Connected;
    }

    protected initConnection() {
        return connect(this.urls, this.options);
    }

    protected invokeDao(DaoConstructor: Constructable<Dao<any>>) {
        return new DaoConstructor(this.connection);
    }
}

export { MongodbPlugin as Plugin };
