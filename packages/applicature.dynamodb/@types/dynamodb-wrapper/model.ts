import {
  hashKey,
  table,
  attribute
} from '@aws/dynamodb-data-mapper-annotations';

@table('Dao')
export class DaoMapped {
  @hashKey()
  clientId: string;
  @attribute()
  projectId?: string;
  @attribute()
  blockchainId?: string;
  @attribute()
  networkId?: string;
  @attribute()
  blockHash?: string;
  @attribute()
  blockHeight?: number;
  @attribute()
  blockTime?: number;
  @attribute()
  minConfirmations?: number;
  @attribute()
  confirmations?: number;
  @attribute()
  txHash?: string;
  @attribute()
  address?: string;
  @attribute()
  type?: string;
  @attribute()
  refId?: string;
  @attribute()
  eventId?: string;
  @attribute()
  params?: object;
}
