/**
 * Based on:
 * https://github.com/vadimdemedes/mongorito/blob/master/lib/database.js
 */

const logger = require('winston');
const config = require('config');

const MongoClient = require('mongodb');

const { AbstractPlugin, MultivestError } = require('@applicature/multivest.core');

const STATE_CONNECTED = 0;
const STATE_CONNECTING = 1;
const STATE_DISCONNECTED = 2;

class MongodbPlugin extends AbstractPlugin {
    constructor(pluginManager) {
        super(pluginManager, 'mongodb');

        this.urls = config.get('multivest.mongodb.url');

        const options = config.get('multivest.mongodb.options');

        if (options) {
            this.options = options;
        }
        else {
            this.options = {
                reconnectTries: 10,
                autoReconnect: true,
            };
        }

        this.dao = {};

        this.daoClasses = [];

        this.state = STATE_DISCONNECTED;
    }

    init() {
        if (this.connection) {
            return Promise.resolve(this.connection);
        }

        this.state = STATE_CONNECTING;

        this.connectionPromise = MongoClient.connect(this.urls, this.options)
            .then((db) => {
                this.connection = db;

// eslint-disable-next-line no-restricted-syntax
                for (const DaoClass of this.daoClasses) {
                    const instance = new DaoClass(db);

                    this.dao[instance.id] = instance;
                }

                return db;
            })
            .then(() => {
                this.state = STATE_CONNECTED;
            })
            .catch((err) => {
                logger.error('Faild to connect to mongodb', err);

                process.exit(1);
            });

        return this.connectionPromise;
    }

    addDao(DaoClass) {
        if (this.state === STATE_CONNECTED) {
            const instance = new DaoClass(this.connection);

            this.dao[instance.id] = instance;
        }
        else {
            this.daoClasses.push(DaoClass);
        }
    }

    getDB() {
        if (this.state === STATE_DISCONNECTED) {
            return Promise.reject(new Error('Database is disconnected.'));
        }

        if (this.state === STATE_CONNECTED) {
            return Promise.resolve(this.connection);
        }

        if (this.state === STATE_CONNECTING) {
            return this.connectionPromise;
        }

        throw new MultivestError('Unrsolved state');
    }

    getDao() {
        if (this.state === STATE_DISCONNECTED) {
            return Promise.reject(new Error('Database is disconnected.'));
        }
        else if (this.state === STATE_CONNECTED) {
            return Promise.resolve(this.dao);
        }
        else if (this.state === STATE_CONNECTING) {
            return this.connectionPromise
                .then(() => this.dao);
        }

        throw new MultivestError('Unrsolved state');
    }

    disconnect() {
        return this.connection()
            .then((db) => {
                db.close();

                this.state = STATE_DISCONNECTED;
            });
    }

    isConnected() {
        return this.state === STATE_CONNECTED;
    }
}

module.exports = MongodbPlugin;
