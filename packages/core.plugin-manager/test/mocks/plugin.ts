import { Plugin } from '../../src/plugin';
import { TestDao } from './dao';
import { TestJob } from './job';

class TestPlugin extends Plugin<any> {

    protected jobClasses = [ TestJob ];
    protected daoClasses = [ TestDao ];

    public getPluginId() {
        return 'test.plugin';
    }

    public init() {
        return;
    }
}

export { TestPlugin as Plugin };
