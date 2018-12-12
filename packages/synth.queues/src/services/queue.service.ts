import { Service } from '@applicature/synth.plugin-manager';
import { Message, Queue } from '../types';

export abstract class QueueService extends Service {
    /** Returns message's ID */
    public abstract sendMessage(queueUniqueTag: string, data: any): Promise<string>;
    public abstract receiveMessage(queueUniqueTag: string): Promise<Message>;

    /** Creates queue and returns `queueUniqueTag` */
    public abstract createQueue(
        queueName: string,
        numPartitions?: number,
        replicationFactor?: number,
        topicConfig?: object
    ): Promise<Queue>;
    public abstract getUniqueTag(name: string): Promise<string>;

    public abstract listQueues(): Promise<Array<Queue>>;
    public abstract deleteQueue(queueUniqueTag: string): Promise<void>;
}
