import { Hashtable } from '@applicature-private/multivest.core';
import { Gauge, Registry } from 'prom-client';
import { CollectableMetricTransport } from './collectable.metric.transport';

export class PrometheusMetricTransport extends CollectableMetricTransport {
    private metrics: Hashtable<Gauge>;
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

    public async saveMetric(
        name: string,
        value: number,
        timestamp: Date = new Date(),
        dimensions: Hashtable<string> = null
    ): Promise<void> {
        const metric = this.metrics[name];

        if (!metric) {
            const metricCfg: any = {
                help: `help for ${ name } metric`,
                name,
            };
            if (dimensions) {
                metricCfg.labelNames = Object.keys(dimensions);
            }

            const newMetric = new Gauge(metricCfg);

            this.metrics[name] = newMetric;
            this.registry.registerMetric(newMetric);
        }

        if (dimensions) {
            metric.inc(dimensions, value, timestamp);
        } else {
            metric.inc(value, timestamp);
        }
    }
}
