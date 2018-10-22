import { DataMapper } from '@aws/dynamodb-data-mapper';
import { DynamoDB } from 'aws-sdk';

export interface DaoModelOptions {
    readCapacityUnits: number;
    writeCapacityUnits: number;
}

export class DynamoWrapperClient {
    protected client: DynamoDB;
    protected mapper: DataMapper;

    constructor(config: any) {
        this.client = new DynamoDB(config);
        this.mapper = new DataMapper({ client: this.client });
    }

    public getMapper(): DataMapper {
        return this.mapper;
    }
}
