import { DynamoDBDao } from '../../src/dynamodb.dao';

export interface DaoMockScheme {
    field: string;
}

export class DaoMock extends DynamoDBDao<DaoMockScheme> {
    public getCollectionName() {
        return 'mock.dao';
    }

    public getDaoId() {
        return 'mock.dao';
    }

    public getDefaultValue() {
        return {} as DaoMockScheme;
    }

    public getMapper() {
        return {};
    }
}
