import { Message } from './main';

export interface AwsMessage extends Message {
    receiptHandle: string;
    bodyMd5: string;
    attributes: AwsAttributes;
}

export interface AwsAttributes {
    approximateFirstReceiveTimestamp: string;
    approximateReceiveCount: string;
    senderId: string;
    sentTimestamp: string;
    messageDeduplicationId: string;
    messageGroupId: string;
    sequenceNumber: string;
}
