import { MultivestError, PluginManager } from '@applicature-private/multivest.core';
import { SQS } from 'aws-sdk';
import * as config from 'config';
import * as logger from 'winston';
import { Errors } from '../errors';
import {
    AwsAttributes,
    AwsMessage,
    AwsMessageAttributes,
    AwsQueueAttributes,
    AwsReceiveAttributes,
    AwsSentMessageMeta,
} from '../types';
import { QueueService } from './queue.service';

export class AwsQueueService extends QueueService {
    private sqs: SQS;

    constructor(pluginManager: PluginManager) {
        super(pluginManager);

        if (config.has('aws.sqs')) {
            const sqsCfg = config.get('aws.sqs');
            this.sqs = new SQS(sqsCfg);
        }
    }

    public getServiceId() {
        return 'aws.queue.service';
    }

    public async receiveMessage<T extends AwsMessageAttributes = AwsMessageAttributes>(
        queueUrl: string,
        messageAttrNames: Array<string>,
        attrNames: Array<AwsReceiveAttributes> = [ AwsReceiveAttributes.All ],
        maxNumbersOfMessages: number = 1,
        waitTimeSeconds: number = null,
        visibilityTimeout: number = null,
        receiveRequestAttemptId: string = null,
    ): Promise<Array<AwsMessage<T>>> {
        if (!this.sqs) {
            logger.error(
                'Settings for sqs was not found. Service was not inited. '
                + 'Specify settings in `aws.sqs` for using service'
            );

            throw new MultivestError(Errors.AWS_SQS_SETTINGS_WAS_NOT_SPECIFIED);
        }

        const params = {
            AttributeNames: attrNames,
            MaxNumberOfMessages: maxNumbersOfMessages,
            MessageAttributeNames: messageAttrNames,
            QueueUrl: queueUrl,
        } as SQS.ReceiveMessageRequest;

        if (waitTimeSeconds || waitTimeSeconds === 0) {
            params.WaitTimeSeconds = waitTimeSeconds;
        }
        if (receiveRequestAttemptId) {
            params.ReceiveRequestAttemptId = receiveRequestAttemptId;
        }
        if (visibilityTimeout || visibilityTimeout === 0) {
            params.VisibilityTimeout = visibilityTimeout;
        }

        try {
            const response = await this.sqs.receiveMessage(params).promise();

            if (response.Messages) {
                const messages = response.Messages.map<AwsMessage<T>>((message) => this.convertAwsMessage<T>(message));
                return messages;
            }

            return [];
        } catch (ex) {
            logger.error(`Cant load received messages. Reason: ${ ex.message }`);
            throw new MultivestError(Errors.AWS_RECEIVING_MESSAGES_FAILED);
        }
    }

    public async sendMessage(
        queueUrl: string,
        messageBody: string,
        messageAttributes: AwsMessageAttributes,
        delaySeconds: number = null,
        messageDeduplicationId: string = null,
        messageGroupId: string = null,
    ): Promise<AwsSentMessageMeta> {
        if (!this.sqs) {
            logger.error(
                'Settings for sqs was not found. Service was not inited. '
                + 'Specify settings in `aws.sqs` for using service'
            );

            throw new MultivestError(Errors.AWS_SQS_SETTINGS_WAS_NOT_SPECIFIED);
        }

        const convertedMessageAttributes = this.convertToSqsMessageAttributes(messageAttributes);
        const params = {
            MessageAttributes: convertedMessageAttributes,
            MessageBody: messageBody,
            QueueUrl: queueUrl,
        } as SQS.SendMessageRequest;

        if (delaySeconds || delaySeconds === 0) {
            params.DelaySeconds = delaySeconds;
        }
        if (messageDeduplicationId) {
            params.MessageDeduplicationId = messageDeduplicationId;
        }
        if (messageGroupId) {
            params.MessageGroupId = messageGroupId;
        }

        try {
            const response = await this.sqs.sendMessage(params).promise();

            return {
                bodyMd5: response.MD5OfMessageBody,
                messageAttributesMd5: response.MD5OfMessageAttributes,
                messageId: response.MessageId,
                sequenceNumber: response.SequenceNumber
            } as AwsSentMessageMeta;
        } catch (ex) {
            logger.error(`Cant send message. Reason: ${ ex.message }`);
            throw new MultivestError(Errors.AWS_SEND_MESSAGE_FAILED);
        }
    }

    public async createQueue(name: string, attributes: AwsQueueAttributes): Promise<string> {
        if (!this.sqs) {
            logger.error(
                'Settings for sqs was not found. Service was not inited. '
                + 'Specify settings in `aws.sqs` for using service'
            );

            throw new MultivestError(Errors.AWS_SQS_SETTINGS_WAS_NOT_SPECIFIED);
        }

        const params = {
            Attributes: this.convertToQueueAttributes(attributes),
            QueueName: name,
        } as SQS.CreateQueueRequest;

        try {
            const response = await this.sqs.createQueue(params).promise();

            return response.QueueUrl;
        } catch (ex) {
            logger.error(`Cant create queue. Reason: ${ ex.message }`);
            throw new MultivestError(Errors.AWS_SQS_CREATE_QUEUE_FAILED);
        }
    }

    public async deleteQueue(queueUrl: string): Promise<void> {
        if (!this.sqs) {
            logger.error(
                'Settings for sqs was not found. Service was not inited. '
                + 'Specify settings in `aws.sqs` for using service'
            );

            throw new MultivestError(Errors.AWS_SQS_SETTINGS_WAS_NOT_SPECIFIED);
        }

        try {
            const params = { QueueUrl: queueUrl } as SQS.DeleteMessageRequest;
            await this.sqs.deleteQueue(params).promise();
        } catch (ex) {
            logger.error(`Cant delete queue. Reason: ${ ex.message }`);
            throw new MultivestError(Errors.AWS_SQS_DELETE_QUEUE_FAILED);
        }
    }

    public async getQueueUrl(name: string, queueOwnerAwsAccountId?: string): Promise<string> {
        if (!this.sqs) {
            logger.error(
                'Settings for sqs was not found. Service was not inited. '
                + 'Specify settings in `aws.sqs` for using service'
            );

            throw new MultivestError(Errors.AWS_SQS_SETTINGS_WAS_NOT_SPECIFIED);
        }

        const params = {
            QueueName: name,
        } as SQS.GetQueueUrlRequest;

        if (queueOwnerAwsAccountId) {
            params.QueueOwnerAWSAccountId = queueOwnerAwsAccountId;
        }

        try {
            const response = await this.sqs.getQueueUrl(params).promise();

            return response.QueueUrl;
        } catch (ex) {
            logger.error(`Cant get queue url. Reason: ${ ex.message }`);
            throw new MultivestError(Errors.AWS_SQS_GET_QUEUE_URL_FAILED);
        }
    }

    public async listQueues(namePrefix: string): Promise<Array<string>> {
        if (!this.sqs) {
            logger.error(
                'Settings for sqs was not found. Service was not inited. '
                + 'Specify settings in `aws.sqs` for using service'
            );

            throw new MultivestError(Errors.AWS_SQS_SETTINGS_WAS_NOT_SPECIFIED);
        }

        const params = {
            QueueNamePrefix: namePrefix,
        } as SQS.ListQueuesRequest;

        try {
            const response = await this.sqs.listQueues(params).promise();

            return response.QueueUrls;
        } catch (ex) {
            logger.error(`Cant list queues. Reason: ${ ex.message }`);
            throw new MultivestError(Errors.AWS_SQS_LIST_QUEUE_FAILED);
        }
    }

    private convertAwsMessage<T extends AwsMessageAttributes = AwsMessageAttributes>(
        message: SQS.Message
    ): AwsMessage<T> {
        const attributes = this.convertFromSqsAttributes(message.Attributes);
        const messageAttributes = this.convertFromSqsMessageAttributes(message.MessageAttributes);

        return {
            attributes,
            body: message.Body,
            bodyMd5: message.MD5OfBody,
            data: messageAttributes,
            messageAttributesMd5: message.MD5OfMessageAttributes,
            messageId: message.MessageId,
            receiptHandle: message.ReceiptHandle,
        } as AwsMessage<T>;
    }

    private convertToSqsMessageAttributes(attributes: AwsMessageAttributes): SQS.MessageBodyAttributeMap {
        const convertedAttributes = Object.keys(attributes || {})
            .reduce<SQS.MessageBodyAttributeMap>((convertedAttrs, key: string) => {
                const value = attributes[key];
                convertedAttrs[key] = {} as any;
                if (value instanceof Array) {
                    if (value[0] instanceof Buffer) {
                        convertedAttrs[key].BinaryListValues = value as Array<Buffer>;
                    } else if (typeof value[0] === 'string') {
                        convertedAttrs[key].StringListValues = value as Array<string>;
                    }
                } else {
                    if (value instanceof Buffer) {
                        convertedAttrs[key].BinaryValue = value as Buffer;
                    } else if (typeof value === 'string') {
                        convertedAttrs[key].StringValue = value as string;
                    }
                }

                return convertedAttrs;
            }, {});

        return convertedAttributes;
    }

    private convertFromSqsMessageAttributes(attributes: SQS.MessageBodyAttributeMap): AwsMessageAttributes {
        const convertedAttributes = Object.keys(attributes || {})
            .reduce<AwsMessageAttributes>((convertedAttrs, key: string) => {
                const attr = attributes[key];
                if (attr.StringValue) {
                    convertedAttrs[key] = attr.StringValue;
                } else if (attr.StringListValues) {
                    convertedAttrs[key] = attr.StringListValues;
                } else if (attr.BinaryValue) {
                    convertedAttrs[key] = attr.BinaryValue as Buffer;
                } else if (attr.BinaryListValues) {
                    convertedAttrs[key] = attr.BinaryListValues as Array<Buffer>;
                }

                return convertedAttrs;
            }, {});

        return convertedAttributes;
    }

    private convertFromSqsAttributes(attributes: SQS.MessageSystemAttributeMap = {}): AwsAttributes {
        return {
            approximateFirstReceiveTimestamp: attributes.ApproximateFirstReceiveTimestamp,
            approximateReceiveCount: attributes.ApproximateReceiveCount,
            messageDeduplicationId: attributes.MessageDeduplicationId,
            messageGroupId: attributes.MessageGroupId,
            senderId: attributes.SenderId,
            sentTimestamp: attributes.SentTimestamp,
            sequenceNumber: attributes.SequenceNumber,
        } as AwsAttributes;
    }

    private convertToQueueAttributes(attributes: AwsQueueAttributes): SQS.QueueAttributeMap {
        return {
            DelaySeconds: attributes.delaySeconds.toString(),
            MaximumMessageSize: attributes.maximumMessageSize.toString(),
            MessageRetentionPeriod: attributes.messageRetentionPeriod.toString(),
            Policy: attributes.policy,
            ReceiveMessageWaitTimeSeconds: attributes.receiveMessageWaitTimeSeconds.toString(),
            RedrivePolicy: attributes.redrivePolicy,
            VisibilityTimeout: attributes.visibilityTimeout.toString(),

            KmsDataKeyReusePeriodSeconds: attributes.kmsDataKeyReusePeriodSeconds.toString(),
            KmsMasterKeyId: attributes.kmsMasterKeyId,

            ContentBasedDeduplication: attributes.contentBasedDeduplication ? 'true' : 'false',
            FifoQueue: attributes.fifoQueue ? 'true' : 'false',
        } as SQS.QueueAttributeMap;
    }
}
