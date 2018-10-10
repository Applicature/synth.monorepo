import { AwsQueueService } from '../../src/services/aws.queue.service';
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

        await service.createQueue(queueName);

        expect(SqsMock.createQueue).toHaveBeenCalledWith({ QueueName: queueName });
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

        await service.listQueues();

        expect(SqsMock.listQueues).toHaveBeenCalledWith();
        expect(SqsMock.listQueues).toHaveBeenCalledTimes(1);
    });

    it('receiveMessage() should transfer correct params', async () => {
        const queueUrl = 'queueUrl';

        await service.receiveMessage(queueUrl);

        expect(SqsMock.receiveMessage).toHaveBeenCalledWith({
            MaxNumberOfMessages: 1,
            QueueUrl: queueUrl,
        });
        expect(SqsMock.receiveMessage).toHaveBeenCalledTimes(1);
    });

    it('sendMessage() should transfer correct params', async () => {
        const queueUrl = 'queueUrl';
        const messageBody = 'messageBody';

        await service.sendMessage(queueUrl, messageBody);

        expect(SqsMock.sendMessage).toHaveBeenCalledWith({
            MessageBody: messageBody,
            QueueUrl: queueUrl,
        });
        expect(SqsMock.sendMessage).toHaveBeenCalledTimes(1);
    });
});
