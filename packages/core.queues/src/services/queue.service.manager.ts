import { Service } from '@applicature/synth.plugin-manager';
import * as config from 'config';
import * as logger from 'winston';
import { QueueServiceType } from '../types';
import { AwsQueueService } from './aws.queue.service';
import { GcPubsubService } from './gc.pubsub.service';
import { QueueStubService } from './queue.stub.service';

export class QueueServiceManager extends Service {
    public getServiceId() {
        return 'queue.service.manager';
    }

    public getQueueService() {
        if (config.has('multivest.queueManager')) {
            const queueType = config.get<QueueServiceType>('multivest.queueManager');

            if (queueType === QueueServiceType.AwsSqs) {
                return this.pluginManager.getServiceByClass(AwsQueueService);
            } else if (queueType === QueueServiceType.GcPubSub) {
                return this.pluginManager.getServiceByClass(GcPubsubService);
            }

            logger.warn(`type [${ queueType }] is specified but it does not supported`);
        }

        return this.pluginManager.getServiceByClass(QueueStubService);
    }
}
