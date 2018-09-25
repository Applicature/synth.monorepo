import { PluginManager, Service } from '@applicature-private/multivest.core';
import { CollectableMetricTransport, MetricTransport } from '../metric.transports';

export abstract class MetricService extends Service {
    protected transport: MetricTransport;

    constructor(pluginManager: PluginManager, transport: MetricTransport) {
        super(pluginManager);

        this.transport = transport;
    }

    public collectMetrics(): any {
        if (this.transport instanceof CollectableMetricTransport) {
            return this.transport.collectMetrics();
        } else {
            return null;
        }
    }
}
