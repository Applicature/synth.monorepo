import { Hashtable } from '@applicature/synth.plugin-manager';

export abstract class MetricTransport {
    public abstract saveMetric(
        name: string,
        value?: number,
        timestamp?: Date,
        dimensions?: Hashtable<string>
    ): Promise<void>;
}
