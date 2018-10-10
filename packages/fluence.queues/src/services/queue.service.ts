import { Service } from '@applicature-private/multivest.core';
import { Message, Queue } from '../types';

export abstract class QueueService extends Service {
    public abstract receiveMessage(queueUniqueTag: string): Promise<Message>;

    /** Returns message's ID */
    public abstract sendMessage(queueUniqueTag: string, data: any): Promise<string>;

    /** Creates queue and returns `queueUniqueTag` */
    public abstract createQueue(queueName: string): Promise<Queue>;

    public abstract listQueues(): Promise<Array<Queue>>;
    public abstract deleteQueue(queueUniqueTag: string): Promise<void>;
}
