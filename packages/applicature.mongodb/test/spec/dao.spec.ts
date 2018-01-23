import { MultivestError, PluginManager } from '@applicature/multivest.core';
import { ObjectId } from 'mongodb';
import { MongoDBDao } from '../../index';
import { Plugin as MongodbPlugin } from '../../src/mongodb.plugin';
import { TestDao, TestDaoScheme } from '../mock/dao.mock';
import { MongodbPluginMock } from '../mock/plugin.mock';

describe('dao data accessing', () => {
    let dao: MongoDBDao<TestDaoScheme>;

    beforeAll(async () => {
        const pluginManager = new PluginManager([]);
        const plugin = new MongodbPluginMock(pluginManager);
        dao = new TestDao(await plugin.init());
    });

    afterEach(async () => {
        await dao.remove({});
    });

    it('should insert and get a record', async () => {
        const result = await dao.create({ field: 'hash' });
        const got = await dao.get({ field: 'hash' });
        expect(got._id).toEqual(result._id);
    });

    it('should insert and get several records', async () => {
        const result = await dao.fill([ { field: 'hash' }, { field: 'hash' } ]);
        const got = await dao.list({ field: 'hash' });
        expect(got.length).toEqual(2);
    });

    it('should modify existing record', async () => {
        const result = await dao.fill([ { field: 'hash' }, { field: '#hash' } ]);
        await dao.update({ field: '#hash'}, { field: '#swash'});
        const got = await dao.get({field: '#swash'});
        expect(got._id).toEqual(result[1]._id);
    });

    it('should remove single record', async () => {
        const result = await dao.fill([ { field: 'hash' }, { field: '#hash' } ]);
        await dao.remove({ field: '#hash'});
        const list = await dao.list({});
        expect(list.length).toEqual(1);
    });

});
