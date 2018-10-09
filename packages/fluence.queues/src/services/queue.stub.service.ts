import { QueueService } from './queue.service';

export class QueueStubService extends QueueService {
    public getServiceId() {
        return 'queue.stub.service';
    }

    public createQueue(): Promise<void> {
        return Promise.resolve();
    }

    public deleteQueue(): Promise<void> {
        return Promise.resolve();
    }

    public listQueues(): Promise<void> {
        return Promise.resolve();
    }

    public sendMessage(): Promise<void> {
        return Promise.resolve();
    }

    public receiveMessage(): Promise<void> {
        return Promise.resolve();
    }
}
