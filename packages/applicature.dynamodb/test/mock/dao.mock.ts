import { attribute, hashKey, table } from '@aws/dynamodb-data-mapper-annotations';
import { DynamoDBDao } from '../../src/dynamodb.dao';
import {Dao} from '@applicature-private/multivest.core';

export interface DaoMockScheme {
    clientId: string;
    projectId: string;
}

@table('Dao')
class DaoMapper {
    @hashKey()
    public clientId: string;
    @attribute()
    public projectId?: string;

    @attribute()
    public blockTime?: number;
}

// tslint:disable-next-line:max-classes-per-file
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
        return new DaoMapper();
    }

    public getMapperClass() {
        return DaoMapper;
    }
}
