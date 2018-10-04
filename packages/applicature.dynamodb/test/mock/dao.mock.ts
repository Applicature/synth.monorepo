import { DynamoScheme } from '../../index';
import { DynamoDBDao } from '../../src/dynamodb.dao';

export interface TestDaoScheme extends DynamoScheme {
  field: string;
}

export class TestDao extends DynamoDBDao<TestDaoScheme> {
  public getCollectionName() {
    return 'test.dao';
  }

  public getDaoId() {
    return 'test.dao';
  }

  public getDefaultValue() {
    return {} as TestDaoScheme;
  }
}
