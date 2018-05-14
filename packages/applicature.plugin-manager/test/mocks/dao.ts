import { Dao } from '../../src/entities/dao';

export class TestDao extends Dao<any> {
    public getDaoId() {
        return 'test.dao';
    }

    public async get() {
        return Promise.resolve({});
    }

    public list() {
        return Promise.resolve([]);
    }

    public update(needle: Partial<any>, substitution: Partial<any>) {
        return Promise.resolve({});
    }

    public create() {
        return Promise.resolve({});
    }

    public remove() {
        return Promise.resolve({});
    }

    public fill() {
        return Promise.resolve([]);
    }
}
