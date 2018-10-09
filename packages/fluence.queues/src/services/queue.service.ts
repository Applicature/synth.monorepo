import { Service } from '@applicature-private/multivest.core';
import { Message } from '../types';

export abstract class QueueService extends Service {
    public abstract receiveMessage(...args: Array<any>): Promise<any>;
    public abstract sendMessage(...args: Array<any>): Promise<any>;

    public abstract createQueue(...args: Array<any>): Promise<any>;
    public abstract listQueues(...args: Array<any>): Promise<any>;
    public abstract deleteQueue(...args: Array<any>): Promise<any>;
}
