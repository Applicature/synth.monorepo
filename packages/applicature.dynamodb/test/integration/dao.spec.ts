import { PluginManager } from '@applicature-private/multivest.core';
import { DataMapper } from '@aws/dynamodb-data-mapper';
import * as AWS from 'aws-sdk';
import * as config from 'config';
import { Plugin as DynamodbPlugin } from '../../src/dynamodb.plugin';
import { DaoMock } from '../mock/dao.mock';

describe('dao data accessing', () => {
    let dao: DaoMock;
    let mapper: DataMapper;

    beforeAll(async () => {
        const pluginManager = new PluginManager([]);
        const plugin = new DynamodbPlugin(pluginManager);
        dao = new DaoMock(await plugin.init());
        AWS.config.update(config.get('multivest.dynamodb'));

        const client = new AWS.DynamoDB(config.get('multivest.dynamodb'));
        mapper = new DataMapper({ client });
        mapper.ensureTableExists(dao.getMapper(), {
            readCapacityUnits: 5,
            writeCapacityUnits: 5
        });
    });

    it('should insert and get a record', async () => {
        const formattedValue = {
            clientId: 'qwe',
            projectId: 'id'
        };

        const result = await dao.create(formattedValue);
        const got = await dao.get({
            clientId: 'qwe'
        });
        expect(result.clientId).toEqual(got.clientId);
    });

    it('should insert and get several records', async () => {
        const formattedValue = [
            {
                clientId: 'i3d',
                projectId: 'id'
            },
            {
                clientId: 'id2',
                projectId: 'id'
            }
        ];
        await dao.fill(formattedValue);

        const got = await dao.list([{ clientId: 'i3d' }, { clientId: 'id2' }]);
        expect(got.length).toEqual(2);
    });

    it('should modify existing record', async () => {
        const gotBefore = await dao.get({
            clientId: 'id2'
        });
        gotBefore.blockTime = 10;
        await dao.update(gotBefore);
        const gotAfter = await dao.get({
            clientId: 'id2'
        });
        expect(gotAfter.blockTime).toEqual(10);
    });

    it('should remove single record', async () => {
        const formattedValue = {
            clientId: 'qwe',
            projectId: 'id'
        };
        const result = await dao.create(formattedValue);
        await dao.remove({
            clientId: 'qwe'
        });
        try {
            await dao.get({
                clientId: 'qwe'
            });
        } catch (err) {
            expect(result.length).toBeUndefined();
        }
    });
});
