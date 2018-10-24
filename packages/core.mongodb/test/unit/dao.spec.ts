import { PluginManager } from '@applicature/synth.plugin-manager';
import { BigNumber } from 'bignumber.js';
import { Decimal128 } from 'mongodb';
import { MongoDBDao } from '../../src/mongodb.dao';
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

describe('MongoDBDao.parseDecimals()', () => {
    it('should parse values', () => {
        const value = '0.38238446535425257365808057865';
        const from = new BigNumber(value);
        const to = Decimal128.fromString(value);

        expect(MongoDBDao.parseDecimals('toMongo', from)).toEqual(to);
        expect(MongoDBDao.parseDecimals('fromMongo', to)).toEqual(from);
        expect(MongoDBDao.parseDecimals('fromMongo', value)).toBe(value);
    });

    it('should parse collection', () => {
        const value = '0.38238446535425257365808057865';
        const from = [value, new BigNumber(value)];
        const to = [value, Decimal128.fromString(value)];

        expect(MongoDBDao.parseDecimals('toMongo', from)).toEqual(to);
        expect(MongoDBDao.parseDecimals('fromMongo', to)).toEqual(from);
    });

    it('should parse hashtable', () => {
        const value = '0.38238446535425257365808057865';
        const from = { value, num: new BigNumber(value) };
        const to = { value, num: Decimal128.fromString(value) };

        expect(MongoDBDao.parseDecimals('toMongo', from)).toEqual(to);
        expect(MongoDBDao.parseDecimals('fromMongo', to)).toEqual(from);
    });

    it('should deep traverse', () => {
        const value1 = '0.38238446535425257365808057865';
        const value2 = '0.85467368478756764563546546645';
        const from = {
            also: value1,
            num: [
                new BigNumber(value1),
                value2,
                {
                    num: new BigNumber(value2),
                },
            ],
        };
        const to = {
            also: value1,
            num: [
                Decimal128.fromString(value1),
                value2,
                {
                    num: Decimal128.fromString(value2),
                },
            ],
        };

        expect(MongoDBDao.parseDecimals('toMongo', from)).toEqual(to);
        expect(MongoDBDao.parseDecimals('fromMongo', to)).toEqual(from);
    });

});
