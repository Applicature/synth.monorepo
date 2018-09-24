import { MetricService } from './metric.service';

export class MetricStubService extends MetricService {
    public getServiceId() {
        return 'MetricMockService';
    }

    protected saveMetric(name: string, value: number, timestamp: Date): Promise<void> {
        return Promise.resolve();
    }
}
