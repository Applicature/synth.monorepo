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
} from '@applicature-private/applicature-sdk.plugin-manager';
import * as config from 'config';
import {connect, Db, MongoClient, MongoClientOptions} from 'mongodb';
import * as logger from 'winston';
import {Errors} from './errors';
import {ConnectionState} from './model';
import {MongoDBDao} from './mongodb.dao';

class MongodbPlugin extends Plugin<any> {
    public state: ConnectionState = ConnectionState.Disconnected;
    protected connection: Db;
    protected client: MongoClient;
    protected connectionPromise: Promise<Db>;
    protected urls: string;
    protected options: MongoClientOptions;
    protected dbName: string;

    constructor(pluginManager: PluginManager) {
        super(pluginManager);

        this.urls = config.get('multivest.mongodb.url');

        this.options = config.has('multivest.mongodb.options')
            ? config.get<MongoClientOptions>('multivest.mongodb.options')
            : { autoReconnect: true, reconnectTries: 10 };

        this.dbName = config.has('multivest.mongodb.dbName')
            ? config.get('multivest.mongodb.dbName')
            : '';
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

    public async disconnect() {
        if (this.state === ConnectionState.Disconnected) {
            return Promise.reject(new MultivestError(Errors.NO_CONNECTION));
        }
        else if (this.state === ConnectionState.Connected) {
            await this.client.close();

            this.state = ConnectionState.Disconnected;
        }
        else if (this.state === ConnectionState.Connecting) {
            return this.connectionPromise
                .then(async () => {
                    await this.client.close();

                    this.state = ConnectionState.Disconnected;
                });
        }
        else {
            return Promise.reject(new MultivestError(Errors.UNRESOLVED_STATE));
        }
    }

    public isConnected() {
        return this.state === ConnectionState.Connected;
    }

    protected async initConnection() {
        this.client = await connect(this.urls, this.options);

        if (!this.dbName) {
            this.dbName = 'test';
        }

        const db = await this.client.db(this.dbName);

        return db;
    }

    protected invokeDao(DaoConstructor: Constructable<Dao<any>>) {
        return new DaoConstructor(this.connection);
    }
}

export { MongodbPlugin as Plugin };
