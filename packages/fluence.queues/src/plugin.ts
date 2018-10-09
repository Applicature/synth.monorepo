import { Plugin } from '@applicature-private/multivest.core';
import { AwsQueueService, GcPubsubService, QueueStubService } from './services';
import {  } from './services/queue.stub.service';

export class FluenceQueuesPlugin extends Plugin<void> {
    public getPluginId() {
        return 'fluence.queues.plugin';
    }

    public init() {
        this.registerService(AwsQueueService);
        this.registerService(GcPubsubService);
        this.registerService(QueueStubService);
    }
}
