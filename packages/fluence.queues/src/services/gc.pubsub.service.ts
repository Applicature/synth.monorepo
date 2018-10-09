import { MultivestError, PluginManager } from '@applicature-private/multivest.core';
// NOTICE: definitions are in progress https://github.com/googleapis/google-cloud-node/issues/952
import * as PubSub from '@google-cloud/pubsub';
import * as config from 'config';
import * as logger from 'winston';
import { Errors } from '../errors';
import { QueueService } from './queue.service';

// NOTICE: spec:
// https://cloud.google.com/nodejs/docs/reference/pubsub/0.20.x/PubSub
// https://cloud.google.com/nodejs/docs/reference/pubsub/0.20.x/v1.PublisherClient
// https://cloud.google.com/nodejs/docs/reference/pubsub/0.20.x/v1.SubscriberClient
export class GcPubsubService extends QueueService {
    private publisher: any;
    private subscriber: any;

    constructor(pluginManager: PluginManager) {
        super(pluginManager);

        if (config.has('gc.pubsub')) {
            if (config.get('gc.pubsub.publisher')) {
                const publisherCfg = config.get('gc.pubsub.publisher');
                this.publisher = new PubSub.v1.PublisherClient(publisherCfg);
            }
            if (config.get('gc.pubsub.subscriber')) {
                const subscriberCfg = config.get('gc.pubsub.subscriber');
                this.subscriber = new PubSub.v1.SubscriberClient(subscriberCfg);
            }
        }
    }
    
    public getServiceId() {
        return 'gc.pubsub.service';
    }

    public async createQueue(name: string): Promise<any> {
        if (!this.publisher) {
            logger.error(
                'Settings for pubsub publisher was not found. Service was not inited. '
                + 'Specify settings in `gc.pubsub.publisher` for using service'
            );

            throw new MultivestError(Errors.GC_PUBSUB_PUBLISHER_SETTINGS_WAS_NOT_SPECIFIED);
        }

        const projectId = await this.getPublisherProjectId();
        const params = {
            name: this.publisher.topicPath(projectId, name)
        };

        try {
            const response = await this.publisher.createTopic(params);
            return response[0];
        } catch (ex) {
            logger.error(`Cant create queue. Reason: ${ ex.message }`);
            throw new Error(Errors.GC_PUBSUB_CREATE_TOPIC_FAILED);
        }
    }

    public async listQueues(): Promise<any> {
        if (!this.publisher) {
            logger.error(
                'Settings for pubsub publisher was not found. Service was not inited. '
                + 'Specify settings in `gc.pubsub.publisher` for using service'
            );

            throw new MultivestError(Errors.GC_PUBSUB_PUBLISHER_SETTINGS_WAS_NOT_SPECIFIED);
        }

        const projectId = await this.getPublisherProjectId();

        const params = {
            project: this.publisher.projectPath(projectId)
        };

        try {
            const response = await this.publisher.listTopics(params);
            return response[0];
        } catch (ex) {
            logger.error(`Cant create queue. Reason: ${ ex.message }`);
            throw new Error(Errors.GC_PUBSUB_LIST_TOPIC_FAILED);
        }
    }

    public async deleteQueue(name: string): Promise<any> {
        if (!this.publisher) {
            logger.error(
                'Settings for pubsub publisher was not found. Service was not inited. '
                + 'Specify settings in `gc.pubsub.publisher` for using service'
            );

            throw new MultivestError(Errors.GC_PUBSUB_PUBLISHER_SETTINGS_WAS_NOT_SPECIFIED);
        }

        const projectId = await this.getPublisherProjectId();

        const params = {
            topic: this.publisher.topicPath(projectId, name)
        };

        try {
            const response = await this.publisher.deleteTopic(params);
            return response[0];
        } catch (ex) {
            logger.error(`Cant create queue. Reason: ${ ex.message }`);
            throw new Error(Errors.GC_PUBSUB_DELETE_TOPIC_FAILED);
        }
    }

    public async sendMessage(queueName: string, data: any): Promise<any> {
        if (!this.publisher) {
            logger.error(
                'Settings for pubsub publisher was not found. Service was not inited. '
                + 'Specify settings in `gc.pubsub.publisher` for using service'
            );

            throw new MultivestError(Errors.GC_PUBSUB_PUBLISHER_SETTINGS_WAS_NOT_SPECIFIED);
        }

        const projectId = await this.getPublisherProjectId();
        const params = {
            messages: [ { data } ],
            topic: this.publisher.topicPath(projectId, queueName),
        };

        try {
            const response = await this.publisher.publish(params);
            return response[0];
        } catch (ex) {
            logger.error(`Cant create queue. Reason: ${ ex.message }`);
            throw new Error(Errors.GC_PUBSUB_DELETE_TOPIC_FAILED);
        }
    }

    public async receiveMessage(
        queueName: string,
        subscriptionName: string,
        handler: (msg: any) => void
    ): Promise<void> {
        logger.warn('Method `receiveMessage` is invalid for GC PubSub. instead use `createSubscription`');
        await this.createSubscription(queueName, subscriptionName, handler);
    }

    public async createSubscription(
        queueName: string,
        subscriptionName: string,
        handler: (msg: any) => void
    ): Promise<void> {
        if (!this.subscriber) {
            logger.error(
                'Settings for pubsub subscriber was not found. Service was not inited. '
                + 'Specify settings in `gc.pubsub.subscriber` for using service'
            );

            throw new MultivestError(Errors.GC_PUBSUB_SUBSCRIBER_SETTINGS_WAS_NOT_SPECIFIED);
        }

        const projectId = await this.getSubscriberProjectId();
        const params = {
            name: this.subscriber.subscriptionPath(projectId, subscriptionName),
            topic: this.subscriber.topicPath(projectId, queueName),
        };

        try {
            const response = await this.subscriber.createSubscription(params);
            const subscription = response[0];
            subscription.on('message', handler);
        } catch (ex) {
            logger.error(`Cant create queue. Reason: ${ ex.message }`);
            throw new Error(Errors.GC_PUBSUB_RECEIVING_MESSAGE_FAILED);
        }
    }

    private getPublisherProjectId(): Promise<string> {
        return new Promise<string>((resolve, reject) => {
            this.publisher.getProjectId((err: Error, projectId: string) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(projectId);
                }
            });
        });
    }

    private getSubscriberProjectId(): Promise<string> {
        return new Promise<string>((resolve, reject) => {
            this.subscriber.getProjectId((err: Error, projectId: string) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(projectId);
                }
            });
        });
    }
}
