import { MetricTransport } from './metric.transport';

export class MetricStubTransport extends MetricTransport {
    public saveMetric(name: string, value: number, timestamp: Date): Promise<void> {
        return Promise.resolve();
    }
}
