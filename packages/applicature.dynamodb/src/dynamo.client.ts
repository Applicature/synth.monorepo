import { WebhookDaoActionItem } from '@applicature-private/multivest.services.blockchain';
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

    public setDaoModel(options: DaoModelOptions): DataMapper {
        this.mapper.ensureTableExists(WebhookDaoActionItem, options);
        return this.mapper;
    }
}
