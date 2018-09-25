export abstract class MetricTransport {
    public abstract saveMetric(name: string, value?: number, timestamp?: Date): Promise<void>;
}
