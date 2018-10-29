import { MultivestError, PluginManager } from '@applicature/synth.plugin-manager';
import { Db, MongoClient } from 'mongodb';
import { MongoDBDao } from '../../index';
import { TestDao, TestDaoScheme } from '../mock/dao.mock';

describe('dao data accessing', () => {
    let dao: MongoDBDao<TestDaoScheme>;
    let connection: MongoClient;
    let db: Db;

    beforeAll(async () => {
        connection = await MongoClient.connect('mongodb://localhost/', {});
        db = connection.db('multivest');
        dao = new TestDao(db);
    });

    afterAll(async () => {
        await connection.close();
    });

    it('should paginate', async () => {
        await dao.fill([
            { field: 1, type: '1' },
            { field: 2, type: '1' },
            { field: 3, type: '1' },
            { field: 4, type: '2' },
        ]);
        const result = await dao.aggregateRaw([
            {
                $group: { _id: '$type', total: { $sum: '$field ' } }
            }
        ]);
        expect(result.length).toBe(2);
    });
});
