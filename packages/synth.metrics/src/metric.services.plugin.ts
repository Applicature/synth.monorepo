import { Plugin } from '../../synth.plugin-manager';

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
