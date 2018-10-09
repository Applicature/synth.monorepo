import { Message } from './main';

export interface AwsMessage<T = AwsMessageAttributes> extends Message<T> {
    messageId: string;
    receiptHandle: string;
    bodyMd5: string;
    body: string;
    attributes: AwsAttributes;
    messageAttributesMd5: string;
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

export interface AwsMessageAttributes {
    [ key: string ]: string | Buffer | Array<string> | Array<Buffer>;
}

export enum AwsReceiveAttributes {
    All = 'All',
    ApproximateFirstReceiveTimestamp = 'ApproximateFirstReceiveTimestamp',
    ApproximateReceiveCount = 'ApproximateReceiveCount',
    SenderId = 'SenderId',
    SentTimestamp = 'SentTimestamp',
    MessageDeduplicationId = 'MessageDeduplicationId',
    MessageGroupId = 'MessageGroupId',
    SequenceNumber = 'SequenceNumber'
}

export interface AwsSentMessageMeta {
    sequenceNumber: string;
    bodyMd5: string;
    messageAttributesMd5: string;
    messageId: string;
}

export interface AwsQueueAttributes {
    delaySeconds: number;
    maximumMessageSize: number;
    messageRetentionPeriod: number;
    policy: string;
    receiveMessageWaitTimeSeconds: number;
    redrivePolicy: string;
    visibilityTimeout: number;

    kmsMasterKeyId: string;
    kmsDataKeyReusePeriodSeconds: number;

    fifoQueue: boolean;
    contentBasedDeduplication: boolean;
}
