import { Dao } from '../../src/entities/dao';

export class TestDao extends Dao<void> {
    public getDaoId() {
        return 'test.dao';
    }

    public get() {
        return Promise.resolve();
    }

    public list() {
        return Promise.resolve([]);
    }

    public update() {
        return Promise.resolve();
    }

    public create() {
        return Promise.resolve();
    }

    public remove() {
        return Promise.resolve();
    }

    public fill() {
        return Promise.resolve([]);
    }
}
