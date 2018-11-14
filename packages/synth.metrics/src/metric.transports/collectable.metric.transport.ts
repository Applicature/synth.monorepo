import { MetricTransport } from './metric.transport';

export abstract class CollectableMetricTransport extends MetricTransport {
    public abstract getCollectedMetrics(): any;
}
