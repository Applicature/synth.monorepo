import { GcPubsubService, Errors } from '../../src';
import { GcPublisherMock, GcSubscriberMock, publisherProjectIdMock, subscriberProjectIdMock } from '../mock';
import { MultivestError } from '@applicature-private/multivest.core';

describe('gc.pubsub.service spec', () => {
    let service: GcPubsubService;

    beforeAll(() => {
        service = new GcPubsubService(null);

        (service as any).publisher = GcPublisherMock;
        (service as any).subscriber = GcSubscriberMock;
    });

    beforeEach(() => {
        Object.keys(GcPublisherMock).forEach((key) => (GcPublisherMock[key] as jest.Mock).mockClear());
        Object.keys(GcSubscriberMock).forEach((key) => (GcSubscriberMock[key] as jest.Mock).mockClear());
    });

    it('createQueue() should transfer correct params', async () => {
        const queueName = 'queueName';

        await service.createQueue(queueName);

        expect(GcPublisherMock.createTopic).toHaveBeenCalledWith({
            name: publisherProjectIdMock + queueName
        });
        expect(GcPublisherMock.createTopic).toHaveBeenCalledTimes(1);
    });

    it('listQueues() should transfer correct params', async () => {
        await service.listQueues();

        expect(GcPublisherMock.listTopics).toHaveBeenCalledWith({
            project: publisherProjectIdMock
        });
        expect(GcPublisherMock.listTopics).toHaveBeenCalledTimes(1);
    });

    it('deleteQueue() should transfer correct params', async () => {
        const queueName = 'queueName';

        await service.deleteQueue(queueName);

        expect(GcPublisherMock.deleteTopic).toHaveBeenCalledWith({
            topic: publisherProjectIdMock + queueName
        });
        expect(GcPublisherMock.deleteTopic).toHaveBeenCalledTimes(1);
    });

    it('sendMessage() should transfer correct params', async () => {
        const queueName = 'queueName';
        const data = 'data';

        await service.sendMessage(queueName, data);

        expect(GcPublisherMock.publish).toHaveBeenCalledWith({
            messages: [ { data }],
            topic: publisherProjectIdMock + queueName
        });
        expect(GcPublisherMock.publish).toHaveBeenCalledTimes(1);
    });

    it('receiveMessage() should transfer correct params', async () => {
        try {
            await service.receiveMessage();
        } catch (ex) {
            expect(ex).toBeInstanceOf(MultivestError);
            expect(ex.message).toEqual(Errors.GC_PUBSUB_METHOD_NOT_SUPPORTED);
        }
    });

    it('createSubscription() should transfer correct params', async () => {
        const queueName = 'queueName';
        const subscriptionName = 'subscriptionName';

        await service.createSubscription(queueName, subscriptionName, null);

        expect(GcSubscriberMock.createSubscription).toHaveBeenCalledWith({
            name: publisherProjectIdMock + subscriptionName,
            topic: publisherProjectIdMock + queueName
        });
        expect(GcSubscriberMock.createSubscription).toHaveBeenCalledTimes(1);
    });
});
