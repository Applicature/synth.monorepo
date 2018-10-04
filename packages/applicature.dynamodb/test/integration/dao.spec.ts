// import { MultivestError, PluginManager } from '@applicature/multivest.core';
import { DynamoDB } from 'aws-sdk';
import { TestDao } from '../mock/dao.mock';

describe('dao data accessing', () => {
  let dao: any;
  let connection: DynamoDB.DocumentClient;

  beforeAll(async () => {
    connection = new DynamoDB.DocumentClient({
      params: {
        region: 'us-east-2',
        accessKeyId: '***REMOVED***',
        secretAccessKey: '***REMOVED***/74BIiT'
      }
    });
    // test
    // dao = new TestDao(connection);
  });

  it('should paginate', async () => {
    await dao.fill([
      { field: 1, type: '1' },
      { field: 2, type: '1' },
      { field: 3, type: '1' },
      { field: 4, type: '2' }
    ]);
    const result = await dao.aggregate([
      {
        $group: { _id: '$type', total: { $sum: '$field ' } }
      }
    ]);
    expect(result.length).toBe(2);
  });
});
