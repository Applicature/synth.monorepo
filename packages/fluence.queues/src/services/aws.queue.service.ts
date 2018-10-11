import { MultivestError, PluginManager } from '@applicature-private/multivest.core';
import { SQS } from 'aws-sdk';
import * as config from 'config';
import * as logger from 'winston';
import { Errors } from '../errors';
import {
    AwsMessage,
    Queue,
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

    public async receiveMessage(queueUrl: string) {
        if (!this.sqs) {
            logger.error(
                'Settings for sqs was not found. Service was not inited. '
                + 'Specify settings in `aws.sqs` for using service'
            );

            throw new MultivestError(Errors.AWS_SQS_SETTINGS_WAS_NOT_SPECIFIED);
        }

        const params = {
            MaxNumberOfMessages: 1,
            QueueUrl: queueUrl,
        } as SQS.ReceiveMessageRequest;

        try {
            const response = await this.sqs.receiveMessage(params).promise();

            if (response.Messages) {
                const message = this.convertAwsMessage(response.Messages[0]);
                return message;
            }

            return null;
        } catch (ex) {
            logger.error(`Cant load received messages. Reason: ${ ex.message }`);
            throw new MultivestError(Errors.AWS_RECEIVING_MESSAGES_FAILED);
        }
    }

    public async sendMessage(
        queueUrl: string,
        messageBody: any,
    ): Promise<string> {
        if (!this.sqs) {
            logger.error(
                'Settings for sqs was not found. Service was not inited. '
                + 'Specify settings in `aws.sqs` for using service'
            );

            throw new MultivestError(Errors.AWS_SQS_SETTINGS_WAS_NOT_SPECIFIED);
        }

        if (typeof messageBody === 'object') {
            messageBody = JSON.stringify(messageBody);
        }

        const params = {
            MessageBody: messageBody,
            QueueUrl: queueUrl,
        } as SQS.SendMessageRequest;

        try {
            const response = await this.sqs.sendMessage(params).promise();

            return response.MessageId;
        } catch (ex) {
            logger.error(`Cant send message. Reason: ${ ex.message }`);
            throw new MultivestError(Errors.AWS_SEND_MESSAGE_FAILED);
        }
    }

    public async createQueue(queueName: string): Promise<Queue> {
        if (!this.sqs) {
            logger.error(
                'Settings for sqs was not found. Service was not inited. '
                + 'Specify settings in `aws.sqs` for using service'
            );

            throw new MultivestError(Errors.AWS_SQS_SETTINGS_WAS_NOT_SPECIFIED);
        }

        const params = {
            QueueName: queueName,
        } as SQS.CreateQueueRequest;

        try {
            const response = await this.sqs.createQueue(params).promise();

            return {
                name: queueName,
                uniqueTag: response.QueueUrl
            };
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

    public async getUniqueTag(queueName: string): Promise<string> {
        if (!this.sqs) {
            logger.error(
                'Settings for sqs was not found. Service was not inited. '
                + 'Specify settings in `aws.sqs` for using service'
            );

            throw new MultivestError(Errors.AWS_SQS_SETTINGS_WAS_NOT_SPECIFIED);
        }

        const params = {
            QueueName: queueName,
        } as SQS.GetQueueUrlRequest;

        try {
            const response = await this.sqs.getQueueUrl(params).promise();

            return response.QueueUrl;
        } catch (ex) {
            logger.error(`Cant get queue url. Reason: ${ ex.message }`);
            throw new MultivestError(Errors.AWS_SQS_GET_QUEUE_URL_FAILED);
        }
    }

    public async listQueues(): Promise<Array<Queue>> {
        if (!this.sqs) {
            logger.error(
                'Settings for sqs was not found. Service was not inited. '
                + 'Specify settings in `aws.sqs` for using service'
            );

            throw new MultivestError(Errors.AWS_SQS_SETTINGS_WAS_NOT_SPECIFIED);
        }

        try {
            const response = await this.sqs.listQueues().promise();

            return response.QueueUrls.map((url) => ({ uniqueTag: url } as Queue));
        } catch (ex) {
            logger.error(`Cant list queues. Reason: ${ ex.message }`);
            throw new MultivestError(Errors.AWS_SQS_LIST_QUEUE_FAILED);
        }
    }

    private convertAwsMessage(
        message: SQS.Message
    ): AwsMessage {
        message.Attributes = message.Attributes || {};
        const attributes = {
            approximateFirstReceiveTimestamp: message.Attributes.ApproximateFirstReceiveTimestamp,
            approximateReceiveCount: message.Attributes.ApproximateReceiveCount,
            messageDeduplicationId: message.Attributes.MessageDeduplicationId,
            messageGroupId: message.Attributes.MessageGroupId,
            senderId: message.Attributes.SenderId,
            sentTimestamp: message.Attributes.SentTimestamp,
            sequenceNumber: message.Attributes.SequenceNumber,
        };

        return {
            attributes,
            bodyMd5: message.MD5OfBody,
            data: message.Body,
            messageId: message.MessageId,
            receiptHandle: message.ReceiptHandle,
        } as AwsMessage;
    }
}
