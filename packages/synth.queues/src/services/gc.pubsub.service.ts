import { Hashtable, MultivestError, PluginManager } from '../../../synth.plugin-manager';
// NOTICE: definitions are in progress https://github.com/googleapis/google-cloud-node/issues/952
import * as PubSub from '@google-cloud/pubsub';
import * as config from 'config';
import { get } from 'lodash';
import * as logger from 'winston';
import { Errors } from '../errors';
import { Message, Queue } from '../types';
import { QueueService } from './queue.service';

// NOTICE: spec:
// https://cloud.google.com/nodejs/docs/reference/pubsub/0.20.x/PubSub
// https://cloud.google.com/nodejs/docs/reference/pubsub/0.20.x/v1.PublisherClient
// https://cloud.google.com/nodejs/docs/reference/pubsub/0.20.x/v1.SubscriberClient
export class GcPubsubService extends QueueService {
    private publisher: any;
    private subscriber: any;

    private subscriptionsNamesMap: Hashtable<{ name: string, subscription: any }>;

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

            this.subscriptionsNamesMap = {};
        }
    }
    
    public getServiceId() {
        return 'gc.pubsub.service';
    }

    public async createQueue(topicName: string): Promise<Queue> {
        if (!this.publisher) {
            logger.error(
                'Settings for pubsub publisher was not found. Service was not inited. '
                + 'Specify settings in `gc.pubsub.publisher` for using service'
            );

            throw new MultivestError(Errors.GC_PUBSUB_PUBLISHER_SETTINGS_WAS_NOT_SPECIFIED);
        }

        const projectId = await this.getPublisherProjectId();
        const params = {
            name: this.publisher.topicPath(projectId, topicName)
        };

        try {
            const response = await this.publisher.createTopic(params);
            const topic = response[0];
            return {
                name: topic.name,
                uniqueTag: topic.name
            };
        } catch (ex) {
            logger.error(`Cant create queue. Reason: ${ ex.message }`);
            throw new Error(Errors.GC_PUBSUB_CREATE_TOPIC_FAILED);
        }
    }

    public getUniqueTag(topicName: string) {
        return Promise.resolve(topicName);
    }

    public async listQueues(): Promise<Array<Queue>> {
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
            return (response[0] || []).map((topic: any) => ({ name: topic.name, uniqueTag: topic.name } as Queue));
        } catch (ex) {
            logger.error(`Cant get list of queues. Reason: ${ ex.message }`);
            throw new Error(Errors.GC_PUBSUB_LIST_TOPIC_FAILED);
        }
    }

    public async deleteQueue(topicName: string): Promise<void> {
        if (!this.publisher) {
            logger.error(
                'Settings for pubsub publisher was not found. Service was not inited. '
                + 'Specify settings in `gc.pubsub.publisher` for using service'
            );

            throw new MultivestError(Errors.GC_PUBSUB_PUBLISHER_SETTINGS_WAS_NOT_SPECIFIED);
        }

        const projectId = await this.getPublisherProjectId();

        const params = {
            topic: this.publisher.topicPath(projectId, topicName)
        };

        try {
            await this.publisher.deleteTopic(params);
        } catch (ex) {
            logger.error(`Cant delete queue. Reason: ${ ex.message }`);
            throw new Error(Errors.GC_PUBSUB_DELETE_TOPIC_FAILED);
        }
    }

    public async sendMessage(topicName: string, data: any): Promise<string> {
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
            topic: this.publisher.topicPath(projectId, topicName),
        };

        try {
            const response = await this.publisher.publish(params);
            const messageId = response[0];
            return messageId;
        } catch (ex) {
            logger.error(`Cant send message. Reason: ${ ex.message }`);
            throw new Error(Errors.GC_PUBSUB_SEND_MESSAGE_FAILED);
        }
    }

    public async receiveMessage(topicName: string): Promise<Message> {
        if (!this.publisher) {
            logger.error(
                'Settings for pubsub publisher was not found. Service was not inited. '
                + 'Specify settings in `gc.pubsub.publisher` for using service'
            );

            throw new MultivestError(Errors.GC_PUBSUB_PUBLISHER_SETTINGS_WAS_NOT_SPECIFIED);
        }

        if (!this.subscriptionsNamesMap[topicName]) {
            const subscriptionName = this.generateSubscriptionName(topicName);
            const subscription = await this.createSubscription(topicName, subscriptionName);
            this.subscriptionsNamesMap[topicName] = { name: subscriptionName, subscription };
        }

        const subscriptionData = this.subscriptionsNamesMap[topicName];

        const projectId = this.getSubscriberProjectId();
        try {
            const response = await this.subscriber.pull({
                maxMessages: 1,
                subscription: this.subscriber.subscriptionPath(projectId, subscriptionData.name),
            });

            const message = get(response, 'received_messages[0].message', null);

            if (message) {
                return {
                    data: message.data,
                    messageId: message.message_id
                };
            }

            return null;
        } catch (ex) {
            logger.error(`Cant pull messages from queue. Reason: ${ ex.message }`);
            throw new Error(Errors.GC_PUBSUB_RECEIVING_MESSAGE_FAILED);
        }
    }

    public async createSubscription(
        topicName: string,
        subscriptionName: string
    ): Promise<any> {
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
            topic: this.subscriber.topicPath(projectId, topicName),
        };

        try {
            const response = await this.subscriber.createSubscription(params);
            return response[0];
        } catch (ex) {
            logger.error(`Cant create queue. Reason: ${ ex.message }`);
            throw new MultivestError(Errors.GC_PUBSUB_CREATE_SUBSCRIPTION_FAILED);
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

    private generateSubscriptionName(topicName: string) {
        return `${ topicName }-subscription`;
    }
}
