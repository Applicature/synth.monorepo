import { PluginManager } from '@applicature-private/multivest.core';
import { DaoMapped } from '../../@types/dynamodb-wrapper/model';
import { TestDao } from '../mock/dao.mock';
import { Plugin as DynamodbPlugin } from '../../src/dynamodb.plugin';

describe('dao data accessing', () => {
  let dao: any;

  beforeAll(async () => {
    const pluginManager = new PluginManager([]);
    const plugin = new DynamodbPlugin(pluginManager);
    dao = new TestDao(await plugin.init());
  });

  it('should insert and get a record', async () => {
    const formattedValue = Object.assign(new DaoMapped(), {
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
    });
    const result = await dao.create(formattedValue);
    const got = await dao.get(
      Object.assign(new DaoMapped(), {
        clientId: 'qwe'
      })
    );
    expect(result.clientId).toEqual(got.clientId);
  });

  it('should insert and get several records', async () => {
    const formattedValue = [
      Object.assign(new DaoMapped(), {
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
      }),
      Object.assign(new DaoMapped(), {
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
      })
    ];
    const result = await dao.fill(formattedValue);

    const got = await dao.listGet([
      Object.assign(new DaoMapped(), { clientId: 'i3d' }),
      Object.assign(new DaoMapped(), { clientId: 'id2' })
    ]);
    expect(got.length).toEqual(2);
  });

  it('should modify existing record', async () => {
    const gotBefore = await dao.get(
      Object.assign(new DaoMapped(), {
        clientId: 'id2'
      })
    );
    gotBefore.blockTime = 10;
    await dao.update(gotBefore);
    const gotAfter = await dao.get(
      Object.assign(new DaoMapped(), {
        clientId: 'id2'
      })
    );
    expect(gotAfter.blockTime).toEqual(10);
  });

  it('should remove single record', async () => {
    const formattedValue = Object.assign(new DaoMapped(), {
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
    });
    const result = await dao.create(formattedValue);
    await dao.remove(
      Object.assign(new DaoMapped(), {
        clientId: 'qwe'
      })
    );
    try {
      const list = await dao.get(
        Object.assign(new DaoMapped(), {
          clientId: 'qwe'
        })
      );
    } catch (err) {
      expect(result.length).toBeUndefined();
    }
  });
});
