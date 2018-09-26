import { Hashtable, PluginManager, Service } from '@applicature-private/multivest.core';
import * as config from 'config';
import { hostname } from 'os';
import { CollectableMetricTransport, MetricTransport } from '../metric.transports';
import { MetricTransportBuilderService } from './metric.transport.builder.service';

export abstract class MetricService extends Service {
    protected transport: MetricTransport;

    private env: string;
    private hostname: string;

    constructor(pluginManager: PluginManager) {
        super(pluginManager);

        this.env = config.util.getEnv('NODE_ENV') || 'no.env';
        this.hostname = hostname();
    }

    public async init(): Promise<void> {
        super.init();

        const transportBuilder =
            this.pluginManager.getServiceByClass(MetricTransportBuilderService) as MetricTransportBuilderService;
        this.transport = transportBuilder.getMetricTransport();
    }

    public collectMetrics(): any {
        if (this.transport instanceof CollectableMetricTransport) {
            return this.transport.getCollectedMetrics();
        } else {
            return null;
        }
    }

    protected async saveMetric(
        name: string,
        value: number,
        timestamp: Date = new Date(),
        dimensions?: Hashtable<string>
    ) {
        const defaultDimensions = {
            env: this.env,
            hostname: this.hostname
        };

        await this.transport.saveMetric(
            name,
            value,
            timestamp,
            dimensions ? Object.assign(defaultDimensions, dimensions) : defaultDimensions
        );
    }
}
