import { DataMapper } from '@aws/dynamodb-data-mapper';
import { DynamoDB } from 'aws-sdk';
import { WebhookDaoActionItem } from './model';

export class DynamoWrapperClient {
    protected client: DynamoDB;
    protected mapper: DataMapper;

    constructor(config: any) {
        this.client = new DynamoDB(config);
        this.mapper = new DataMapper({ client: this.client });
    }

    public setDaoModel(): DataMapper {
        this.mapper.ensureTableExists(WebhookDaoActionItem, {
            readCapacityUnits: 5,
            writeCapacityUnits: 5
        });
        return this.mapper;
    }
}
