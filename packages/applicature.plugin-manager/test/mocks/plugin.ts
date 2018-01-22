import { Plugin } from '../../src/plugin';
import { TestJob } from './job';
import { TestDao } from './dao';

export class EmptyPlugin extends Plugin<void> {

    getPluginId() {
        return 'empty.plugin';
    }

    init() {}
}


class TestPlugin extends Plugin<void> {

    protected jobClasses = [ TestJob ];
    protected daoClasses = [ TestDao ];

    getPluginId() {
        return 'test.plugin';
    }

    init() {}
}

export { TestPlugin as Plugin };

