import { PluginManager } from '@applicature/synth.plugin-manager';
import * as config from 'config';
import * as kafka from 'node-rdkafka';
import * as logger from 'winston';
import { Message, Queue } from '../types';
import { QueueService } from './queue.service';
export class KafkaQueueService extends QueueService {
    private producerReady: any;
    private consumerReady: any;
    private adminClient: kafka.InternalAdminClient;
    private topics: Set<string>;

    constructor(pluginManager: PluginManager) {
        super(pluginManager);

        this.init();
    }

    public async init() {
        const producer = new kafka.Producer(
            config.get('kafka.producer.config'),
            config.get('kafka.producer.topicConfig')
        );
        producer.connect(
            {},
            (err: any) => {
                if (err) {
                    logger.error('connect', err);
                }
            }
        );
        this.producerReady = new Promise((resolve: any) => {
            producer.on('ready', () => {
                logger.info('producer ready');
                resolve(producer);
            });
        });

        const consumer = new kafka.KafkaConsumer(
            config.get('kafka.consumer.config'),
            config.get('kafka.consumer.topicConfig')
        );
        consumer.connect(
            {},
            (err: any) => {
                if (err) {
                    logger.error('connect', err);
                }
            }
        );
        this.consumerReady = new Promise((resolve: any) => {
            consumer.on('ready', () => {
                logger.info('consumer ready');
                resolve(consumer);
            });
        });

        const client = new kafka.AdminClient();
        this.adminClient = client.create(config.get('kafka.admin.config'));
    }

    public async createQueue(queueName: string): Promise<Queue> {
        return new Promise<Queue>((resolve: any) => {
            this.adminClient.createTopic(
                {
                    config: config.get('kafka.admin.topicConfig'),
                    num_partitions: config.get('kafka.admin.numPartitions'),
                    replication_factor: config.get('kafka.admin.replicationFactor'),
                    topic: queueName
                },
                (err: any, data: any) => {
                    if (err) {
                        logger.error('Topic can`t be created!');
                        throw err;
                    }
                    this.topics.add(queueName);
                    resolve({
                        name: queueName,
                        uniqueTag: data.name
                    });
                }
            );
        });
    }

    public async deleteQueue(topicName: string): Promise<void> {
        this.adminClient.deleteTopic(topicName);
    }

    public async listQueues(): Promise<any> {
        return this.topics;
    }

    public async receiveMessage(topicName: string): Promise<Message> {
        return this.consumerReady
            .then((consumer: kafka.KafkaConsumer) => {
                consumer.subscribe([topicName]);
                consumer.consume();
                return consumer;
            })
            .then((consumer: kafka.KafkaConsumer) => {
                consumer.once('data', (data: any) => {
                    return { data: data.value.toString() };
                });
            });
    }

    public async sendMessage(topicName: string, message: string): Promise<any> {
        return this.producerReady
            .then((producer: kafka.Producer) => {
                producer.produce(topicName, null, Buffer.from(message));
            })
            .catch((error: any) => logger.error('unable to send message', error));
    }

    public getServiceId() {
        return 'kafka.queue.service';
    }

    public async getUniqueTag(queueName: string): Promise<string> {
        return Promise.resolve(queueName);
    }
}
