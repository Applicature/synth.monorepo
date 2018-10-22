import { PluginManager } from '@applicature-private/multivest.core';
import * as AWS from 'aws-sdk';
import * as config from 'config';
import { Plugin as DynamodbPlugin } from '../../src/dynamodb.plugin';
import { DaoMock } from '../mock/dao.mock';

describe('dao data accessing', () => {
    let dao: any;

    beforeAll(async () => {
        const pluginManager = new PluginManager([]);
        const plugin = new DynamodbPlugin(pluginManager);
        dao = new DaoMock(await plugin.init());
        AWS.config.update(config.get('multivest.dynamodb'));
    });

    it('should create table', async () => {
        const dynamo = new AWS.DynamoDB();

        const params = {
            TableName: 'Dao',
            KeySchema: [{ AttributeName: 'year', KeyType: 'HASH' }, { AttributeName: 'title', KeyType: 'RANGE' }],
            AttributeDefinitions: [
                { AttributeName: 'year', AttributeType: 'N' },
                { AttributeName: 'title', AttributeType: 'S' }
            ],
            ProvisionedThroughput: {
                ReadCapacityUnits: 10,
                WriteCapacityUnits: 10
            }
        };

        dynamo.createTable(params, (err, data) => {
            if (err) {
                throw err;
            } else {
                expect(data).toBeTruthy();
            }
        });
    });

    it('should insert and get a record', async () => {
        const formattedValue = {
            clientId: 'qwe',
            projectId: 'id',
            blockchainId: 'id',
            networkId: 'id',
            blockHash: 'id',
            blockHeight: 4,
            blockTime: 3,
            minConfirmations: 5,
            confirmations: 2,
            txHash: 'id',
            address: 'id',
            type: 'id',
            refId: 'id',
            eventId: 'id',
            params: {}
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
                projectId: 'id',
                blockchainId: 'id',
                networkId: 'id',
                blockHash: 'id',
                blockHeight: 4,
                blockTime: 3,
                minConfirmations: 5,
                confirmations: 2,
                txHash: 'id',
                address: 'id',
                type: 'id',
                refId: 'id',
                eventId: 'id',
                params: 5
            },
            {
                clientId: 'id2',
                projectId: 'id',
                blockchainId: 'id',
                networkId: 'id',
                blockHash: 'id',
                blockHeight: 4,
                blockTime: 3,
                minConfirmations: 5,
                confirmations: 2,
                txHash: 'id',
                address: 'id',
                type: 'id',
                refId: 'id',
                eventId: 'id',
                params: 5
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
            projectId: 'id',
            blockchainId: 'id',
            networkId: 'id',
            blockHash: 'id',
            blockHeight: 4,
            blockTime: 3,
            minConfirmations: 5,
            confirmations: 2,
            txHash: 'id',
            address: 'id',
            type: 'id',
            refId: 'id',
            eventId: 'id',
            params: {}
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
