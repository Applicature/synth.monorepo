export abstract class MetricTransport {
    protected abstract saveMetric(name: string, value?: number, timestamp?: Date): Promise<void>;
}
