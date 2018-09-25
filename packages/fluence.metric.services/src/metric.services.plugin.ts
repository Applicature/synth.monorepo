import { Plugin } from '@applicature-private/multivest.core';

import {
    MetricTransportBuilderService,
} from './services';

class MetricServicesPlugin extends Plugin<void> {
    public getPluginId() {
        return 'metric.services';
    }

    public init() {
        this.registerService(MetricTransportBuilderService);
    }
}

export { MetricServicesPlugin as Plugin };
