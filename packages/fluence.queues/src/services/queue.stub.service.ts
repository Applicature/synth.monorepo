import { QueueService } from './queue.service';

export class QueueStubService extends QueueService {
    public getServiceId() {
        return 'queue.stub.service';
    }

    public receiveMessage(queueUniqueTag: string): Promise<any> {
        return Promise.resolve();
    }

    public sendMessage(queueUniqueTag: string, data: any): Promise<any> {
        return Promise.resolve();
    }

    public createQueue(queueName: string): Promise<any> {
        return Promise.resolve();
    }

    public listQueues(filterQuery?: string): Promise<any> {
        return Promise.resolve();
    }
    public deleteQueue(queueUniqueTag: string): Promise<void> {
        return Promise.resolve();
    }
}
