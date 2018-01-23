import { MongoScheme } from '../../index';
import { MongoDBDao } from '../../src/mongodb.dao';

export interface TestDaoScheme extends MongoScheme {
    field: string;
}

export class TestDao extends MongoDBDao<TestDaoScheme> {
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
