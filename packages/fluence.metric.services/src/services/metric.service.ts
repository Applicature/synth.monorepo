import { PluginManager, Service } from '@applicature-private/multivest.core';
import { CollectableMetricTransport, MetricTransport } from '../metric.transports';
import { MetricTransportBuilderService } from './metric.transport.builder.service';

export abstract class MetricService extends Service {
    protected transport: MetricTransport;

    public async init(): Promise<void> {
        super.init();

        const transportBuilder =
            this.pluginManager.getServiceByClass(MetricTransportBuilderService) as MetricTransportBuilderService;
        this.transport = transportBuilder.getMetricTransport();
    }

    public collectMetrics(): any {
        if (this.transport instanceof CollectableMetricTransport) {
            return this.transport.collectMetrics();
        } else {
            return null;
        }
    }
}
