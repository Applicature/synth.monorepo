import { Plugin } from '../../src/plugin';
import { TestJob } from './job';

export class TestPlugin extends Plugin<void> {

    getPluginId() {
        return 'test.plugin';
    }

    init() {}
}


class TestPluginWithJob extends Plugin<void> {

    jobClasses: [ TestJob ];

    getPluginId() {
        return 'test.plugin.with.job';
    }

    init() {}
}

export { TestPluginWithJob as Plugin };

