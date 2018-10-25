import { Plugin } from '@applicature/synth.plugin-manager';
import { AwsQueueService, GcPubsubService, QueueStubService } from './services';
import {  } from './services/queue.stub.service';

class FluenceQueuesPlugin extends Plugin<void> {
    public getPluginId() {
        return 'fluence.queues.plugin';
    }

    public init() {
        this.registerService(AwsQueueService);
        this.registerService(GcPubsubService);
        this.registerService(QueueStubService);
    }
}

export { FluenceQueuesPlugin as Plugin };
