import { MultivestError, PluginManager, Service } from '@applicature-private/multivest.core';
import * as config from 'config';
import * as logger from 'winston';
import { Errors } from '../errors';
import { MetricTypes } from '../types';
import { AwsMetricService } from './aws.metric.service';
import { MetricService } from './metric.service';
import { MetricStubService } from './metric.stub.service';
import { PrometheusMetricService } from './prometheus.metric.service';

export class MetricBuilderService extends Service {
    private isMetricEnabled: boolean;
    private metricService: MetricService;

    constructor(pluginManager: PluginManager) {
        super(pluginManager);

        this.isMetricEnabled = config.has('multivest.metrics.enabled')
            ? config.get('multivest.metrics.enabled')
            : false;
        this.metricService = null;
    }

    public getServiceId(): string {
        return 'metric.builder.service';
    }

    public getMetricService(): MetricService {
        if (this.isMetricEnabled) {
            this.metricService = this.pluginManager.getServiceByClass(MetricStubService) as MetricStubService;
        }
        
        if (this.metricService) {
            return this.metricService;
        }

        if (!config.has('multivest.metrics.type')) {
            throw new MultivestError(Errors.METRIC_TYPE_NOT_SPECIFIED);
        }

        const metricType = config.get<MetricTypes>('multivest.metrics.type');
        if (metricType === MetricTypes.CloudWatch) {
            this.metricService = this.pluginManager.getServiceByClass(AwsMetricService) as AwsMetricService;
        } else if (metricType === MetricTypes.Prometheus) {
            this.metricService =
                this.pluginManager.getServiceByClass(PrometheusMetricService) as PrometheusMetricService;
        } else {
            logger.warn(`metrics are enabled but specified type is not supported: ${ metricType }`);
            this.metricService = this.pluginManager.getServiceByClass(MetricStubService) as MetricStubService;
        }

        return this.metricService;
    }
}
