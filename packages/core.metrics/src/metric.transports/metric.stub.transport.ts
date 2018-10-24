import { Hashtable } from '@applicature-private/multivest.core';
import { MetricTransport } from './metric.transport';

export class MetricStubTransport extends MetricTransport {
    public saveMetric(name: string, value: number, timestamp?: Date, dimensions?: Hashtable<string>): Promise<void> {
        return Promise.resolve();
    }
}
