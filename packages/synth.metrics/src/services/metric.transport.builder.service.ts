import { MultivestError, PluginManager, Service } from '@applicature/synth.plugin-manager';
import * as config from 'config';
import * as logger from 'winston';
import { Errors } from '../errors';
import {
    AwsMetricTransport,
    MetricStubTransport,
    MetricTransport,
    PrometheusMetricTransport
} from '../metric.transports';
import { MetricTypes } from '../types';

export class MetricTransportBuilderService extends Service {
    private isMetricEnabled: boolean;
    private metricTransport: MetricTransport;

    constructor(pluginManager: PluginManager) {
        super(pluginManager);

        this.isMetricEnabled = config.has('multivest.metrics.enabled')
            ? config.get('multivest.metrics.enabled')
            : false;
        this.metricTransport = null;
    }

    public getServiceId(): string {
        return 'metric.builder.service';
    }

    public getMetricTransport(): MetricTransport {
        if (this.isMetricEnabled === false) {
            this.metricTransport = new MetricStubTransport();
        }
        
        if (this.metricTransport) {
            return this.metricTransport;
        }

        if (!config.has('multivest.metrics.type')) {
            throw new MultivestError(Errors.METRIC_TYPE_NOT_SPECIFIED);
        }

        const metricType = config.get<MetricTypes>('multivest.metrics.type');
        if (metricType === MetricTypes.CloudWatch) {
            this.metricTransport = new AwsMetricTransport();
        } else if (metricType === MetricTypes.Prometheus) {
            this.metricTransport = new PrometheusMetricTransport();
        } else {
            logger.warn(`metrics are enabled but specified type is not supported: ${ metricType }`);
            this.metricTransport = new MetricStubTransport();
        }

        return this.metricTransport;
    }
}
