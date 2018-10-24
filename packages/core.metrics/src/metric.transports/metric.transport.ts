import { Hashtable } from '@applicature-private/multivest.core';

export abstract class MetricTransport {
    public abstract saveMetric(
        name: string,
        value?: number,
        timestamp?: Date,
        dimensions?: Hashtable<string>
    ): Promise<void>;
}
