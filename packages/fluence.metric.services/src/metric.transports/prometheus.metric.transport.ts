import { Hashtable } from '@applicature-private/multivest.core';
import { Counter, Registry } from 'prom-client';
import { CollectableMetricTransport } from './collectable.metric.transport';

export class PrometheusMetricTransport extends CollectableMetricTransport {
    private metrics: Hashtable<Counter>;
    private registry: Registry;

    constructor() {
        super();

        this.metrics = {};
        this.registry = new Registry();
    }

    public collectMetrics(): string {
        const collectedData = this.registry.metrics();
        this.registry.resetMetrics();

        return collectedData;
    }

    protected async saveMetric(name: string, value: number, timestamp: Date = new Date()): Promise<void> {
        const metric = this.metrics[name];

        if (metric) {
            metric.inc(value, timestamp);
        } else {
            const newMetric = new Counter({
                help: `help for ${ name } metric`,
                name,
            });

            this.metrics[name] = newMetric;
            this.registry.registerMetric(newMetric);
        }

        return;
    }
}
