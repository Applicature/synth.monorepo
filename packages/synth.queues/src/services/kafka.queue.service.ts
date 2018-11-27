import { MultivestError, PluginManager } from '@applicature/synth.plugin-manager';
import * as config from 'config';
import { createReadStream, createWriteStream, KafkaConsumer } from 'node-rdkafka';
import * as logger from 'winston';
import { Errors } from '../errors';
import { Message, Queue } from '../types';
import { QueueService } from './queue.service';

export class KafkaQueueService extends QueueService {
    private producer: any;
    private consumer: any;

    constructor(pluginManager: PluginManager) {
        super(pluginManager);
        if (config.has('kafka.consumer')) {
            const kafkaConsumer = config.get('kafka.global');
            this.consumer = new KafkaConsumer(kafkaConsumer, {});
        }
    }
    public async createQueue(queueName: string): Promise<Queue> {
        if (config.has('kafka.consumer')) {
            this.consumer = createReadStream(config.get('kafka.global'), config.get('kafka.topic'), {
                topics: queueName
            });
            this.consumer.setPollInterval(100);
        } else {
            throw new MultivestError(Errors.KAFKA_CONFIG_NOT_FOUND);
        }

        if (config.has('kafka.producer')) {
            this.producer = createWriteStream(config.get('kafka.global'), config.get('kafka.topic'), {
                topics: queueName
            });
            this.producer.setPollInterval(100);
        } else {
            throw new MultivestError(Errors.KAFKA_CONFIG_NOT_FOUND);
        }
        return Promise.resolve({
            uniqueTag: queueName
        });
    }
    public async deleteQueue(queueUrl: string): Promise<void> {
        this.producer = null;
        this.consumer = null;
    }
    public async listQueues(): Promise<Array<Queue>> {
        return Promise.resolve([
            {
                name: '',
                uniqueTag: ''
            }
        ]);
    }
    public async receiveMessage(): Promise<Message> {
        let data = null;

        this.consumer.on('data', (message: any) => {
            logger.log('info', 'Got message');
            logger.log('info', message.value.toString());
            data = message.value.toString();
        });

        return Promise.resolve({
            data
        });
    }
    public async sendMessage(_: any, topic: any): Promise<string> {
        const queuedSuccess = this.producer.write(Buffer.from(topic));

        if (queuedSuccess) {
            logger.log('info', 'We queued our message!');
        } else {
            logger.log('info', 'Too many messages in our queue already');
        }

        this.producer.on('error', (err: any) => {
            logger.error('Error in our kafka stream');
            logger.error(err);
        });
        return 'Done!';
    }
    public getServiceId() {
        return 'kafka.queue.service';
    }
    public async getUniqueTag(queueName: string): Promise<string> {
        return Promise.resolve('');
    }
}
