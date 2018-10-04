import { DaoMapped } from './model';
import { DynamoDB } from 'aws-sdk';
import { DataMapper } from '@aws/dynamodb-data-mapper';

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
        .then(value => {
          console.log('Created: ', value);
        })
        .catch(err => {
          reject(err);
        });
      resolve(this.mapper);
    });
  }
}
