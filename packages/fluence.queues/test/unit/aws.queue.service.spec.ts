import { AwsQueueService } from '../../src/services/aws.queue.service';
import { AwsQueueAttributes, AwsReceiveAttributes } from '../../src/types';
import { SqsMock } from '../mock';

// tslint:disable:object-literal-sort-keys

describe('aws.queue.service spec', () => {
    let service: AwsQueueService;

    beforeAll(() => {
        service = new AwsQueueService(null);

        (service as any).sqs = SqsMock;
    });

    beforeEach(() => {
        Object.keys(SqsMock).forEach((key) => (SqsMock[key] as jest.Mock).mockClear());
    });

    it('createQueue() should transfer correct params', async () => {
        const queueName = 'queueName';
        const attributes = {
            delaySeconds: 0,
            maximumMessageSize: 0,
            messageRetentionPeriod: 0,
            policy: 'policy',
            receiveMessageWaitTimeSeconds: 0,
            redrivePolicy: 'redrivePolicy',
            visibilityTimeout: 0,
            kmsDataKeyReusePeriodSeconds: 0,
            kmsMasterKeyId: 'kmsMasterKeyId',
            contentBasedDeduplication: false,
            fifoQueue: false
        } as AwsQueueAttributes;

        await service.createQueue(queueName, attributes);

        expect(SqsMock.createQueue).toHaveBeenCalledWith({
            QueueName: queueName,
            Attributes: {
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
            }
        });
        expect(SqsMock.createQueue).toHaveBeenCalledTimes(1);
    });

    it('deleteQueue() should transfer correct params', async () => {
        const queueUrl = 'queueUrl';

        await service.deleteQueue(queueUrl);

        expect(SqsMock.deleteQueue).toHaveBeenCalledWith({
            QueueUrl: queueUrl,
        });
        expect(SqsMock.deleteQueue).toHaveBeenCalledTimes(1);
    });

    it('getQueueUrl() should transfer correct params', async () => {
        const queueName = 'queueName';

        await service.getQueueUrl(queueName);

        expect(SqsMock.getQueueUrl).toHaveBeenCalledWith({
            QueueName: queueName,
        });
        expect(SqsMock.getQueueUrl).toHaveBeenCalledTimes(1);
    });

    it('listQueues() should transfer correct params', async () => {
        const namePrefix = 'namePrefix';

        await service.listQueues(namePrefix);

        expect(SqsMock.listQueues).toHaveBeenCalledWith({
            QueueNamePrefix: namePrefix,
        });
        expect(SqsMock.listQueues).toHaveBeenCalledTimes(1);
    });

    it('receiveMessage() should transfer correct params', async () => {
        const queueUrl = 'queueUrl';
        const messageAttrNames = [ 'messageAttrNames' ];
        const attrNames = [ AwsReceiveAttributes.All ];
        const maxNumbersOfMessages = 1;
        const waitTimeSeconds = 10;
        const visibilityTimeout = 1;
        const receiveRequestAttemptId = 'receiveRequestAttemptId';

        await service.receiveMessage(
            queueUrl,
            messageAttrNames,
            attrNames,
            maxNumbersOfMessages,
            waitTimeSeconds,
            visibilityTimeout,
            receiveRequestAttemptId
        );

        expect(SqsMock.receiveMessage).toHaveBeenCalledWith({
            AttributeNames: attrNames,
            MaxNumberOfMessages: maxNumbersOfMessages,
            MessageAttributeNames: messageAttrNames,
            QueueUrl: queueUrl,
            WaitTimeSeconds: waitTimeSeconds,
            ReceiveRequestAttemptId: receiveRequestAttemptId,
            VisibilityTimeout: visibilityTimeout
        });
        expect(SqsMock.receiveMessage).toHaveBeenCalledTimes(1);
    });

    it('sendMessage() should transfer correct params', async () => {
        const queueUrl = 'queueUrl';
        const messageBody = 'messageBody';
        const delaySeconds = 1;
        const messageDeduplicationId = 'messageDeduplicationId';
        const messageGroupId = 'messageGroupId';

        const buffer = Buffer.from('data');
        const arrayBuffer = [ buffer ];
        const stringData = 'data';
        const arrayStringData = [ 'data' ];
        const messageAttributes = { buffer, arrayBuffer, stringData, arrayStringData };

        await service.sendMessage(
            queueUrl,
            messageBody,
            messageAttributes,
            delaySeconds,
            messageDeduplicationId,
            messageGroupId
        );

        expect(SqsMock.sendMessage).toHaveBeenCalledWith({
            MessageAttributes: {
                buffer: {
                    BinaryValue: buffer,
                },
                arrayBuffer: {
                    BinaryListValues: arrayBuffer,
                },
                stringData: {
                    StringValue: stringData,
                },
                arrayStringData: {
                    StringListValues: arrayStringData,
                },
            },
            MessageBody: messageBody,
            QueueUrl: queueUrl,
            DelaySeconds: delaySeconds,
            MessageDeduplicationId: messageDeduplicationId,
            MessageGroupId: messageGroupId
        });
        expect(SqsMock.sendMessage).toHaveBeenCalledTimes(1);
    });
});
