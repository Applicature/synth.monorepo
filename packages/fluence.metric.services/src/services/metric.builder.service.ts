import { MultivestError, PluginManager, Service } from '@applicature-private/multivest.core';
import * as config from 'config';
import { Errors } from '../errors';
import { MetricTypes } from '../types';
import { AwsMetricService } from './aws.metric.service';
import { MetricService } from './metric.service';

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
        if (!this.isMetricEnabled) {
            return null;
        } else if (this.metricService) {
            return this.metricService;
        }

        if (!config.has('multivest.metrics.type')) {
            throw new MultivestError(Errors.METRIC_TYPE_NOT_SPECIFIED);
        }

        const metricType = config.get<MetricTypes>('multivest.metrics.type');
        if (metricType === MetricTypes.CloudWatch) {
            this.metricService = this.pluginManager.getServiceByClass(AwsMetricService) as AwsMetricService;
        } else if (metricType === MetricTypes.Prometheus) {
            this.metricService = this.pluginManager.getServiceByClass(AwsMetricService) as AwsMetricService;
        }

        return this.metricService;
    }
}
