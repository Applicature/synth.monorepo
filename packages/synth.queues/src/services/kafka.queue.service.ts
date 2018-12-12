import { PluginManager } from '@applicature/synth.plugin-manager';
import * as kafka from 'node-rdkafka';
import * as logger from 'winston';
import { KafkaConfig, Message, Queue } from '../types';
import { QueueService } from './queue.service';
export class KafkaQueueService extends QueueService {
    private producerReady: any;
    private consumerReady: any;
    private adminClient: kafka.InternalAdminClient;
    private topics: Set<string>;

    // tslint:disable-next-line:no-shadowed-variable
    constructor(pluginManager: PluginManager, config: KafkaConfig) {
        super(pluginManager);

        const producer = new kafka.Producer(config.producerConfig, config.topicConfig);
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

        const consumer = new kafka.KafkaConsumer(config.consumerConfig, config.topicConfig);
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
        this.adminClient = client.create(config.adminConfig);
    }

    public async createQueue(
        queueName: string,
        numPartitions: number,
        replicationFactor: number,
        topicConfig: object
    ): Promise<Queue> {
        return new Promise<Queue>((resolve: any) => {
            this.adminClient.createTopic(
                {
                    config: topicConfig,
                    num_partitions: numPartitions,
                    replication_factor: replicationFactor,
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
        return Promise.resolve('');
    }
}
