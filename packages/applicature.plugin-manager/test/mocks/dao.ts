import { Dao } from '../../src/entities/dao';


export class TestDao extends Dao<void> {
    getDaoId() {
        return 'test.dao';
    }

    get() {
        return Promise.resolve();
    }

    list() {
        return Promise.resolve([]);
    }

    update() {
        return Promise.resolve();
    }

    create() {
        return Promise.resolve();
    }

    remove() {
        return Promise.resolve();
    }
}
