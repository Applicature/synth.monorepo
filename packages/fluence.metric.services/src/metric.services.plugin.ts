import { Plugin } from '@applicature-private/multivest.core';

import {
    AwsMetricService,
    MetricBuilderService,
    PrometheusMetricService,
} from './services';

class MetricServicesPlugin extends Plugin<void> {
    public getPluginId() {
        return 'metric.services';
    }

    public init() {
        this.registerService(AwsMetricService);
        this.registerService(MetricBuilderService);
        this.registerService(PrometheusMetricService);
    }
}

export { MetricServicesPlugin as Plugin };
