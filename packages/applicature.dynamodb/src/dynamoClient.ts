import { DataMapper } from '@aws/dynamodb-data-mapper';
import { DynamoDB } from 'aws-sdk';
import { DaoMapped } from './model';

export class DynamoWrapperClient {
  protected client: any;
  protected mapper: DataMapper;

  constructor(config: any) {
    this.client = new DynamoDB(config);
    this.mapper = new DataMapper({ client: this.client });
  }

  public setDaoModel(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.mapper
        .ensureTableExists(DaoMapped, {
          readCapacityUnits: 5,
          writeCapacityUnits: 5
        })
        .catch((err) => {
          reject(err);
        });
      resolve(this.mapper);
    });
  }
}
