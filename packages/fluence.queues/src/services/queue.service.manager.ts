import { Service } from '@applicature-private/multivest.core';
import * as config from 'config';
import { AwsQueueService } from './aws.queue.service';
import { GcPubsubService } from './gc.pubsub.service';
import { QueueStubService } from './queue.stub.service';

export class QueueServiceManager extends Service {
    public getServiceId() {
        return 'queue.service.manager';
    }

    public getQueueService() {
        if (config.has('aws.sqs')) {
            return this.pluginManager.getServiceByClass(AwsQueueService);
        } else if (config.has('gc.pubsub.publisher') || config.has('gc.pubsub.subscriber')) {
            return this.pluginManager.getServiceByClass(GcPubsubService);
        } else {
            return this.pluginManager.getServiceByClass(QueueStubService);
        }
    }
}
