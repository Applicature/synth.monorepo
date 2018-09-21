import { Hashtable, PluginManager } from '@applicature-private/multivest.core';
import { Counter, Registry } from 'prom-client';
import { MetricService } from './metric.service';

export class PrometheusMetricService extends MetricService {
    private metrics: Hashtable<Counter>;
    private registry: Registry;

    constructor(pluginManager: PluginManager) {
        super(pluginManager);

        this.metrics = {};
        this.registry = new Registry();
    }

    public getServiceId() {
        return 'prometheus.metric.service';
    }

    public collectAndResetMetrics(): string {
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
