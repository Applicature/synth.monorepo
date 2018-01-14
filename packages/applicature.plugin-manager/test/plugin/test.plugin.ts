import { Plugin } from '../../index';

class TestPlugin extends Plugin<void> {
    public getPluginId() {
        return 'test.plugin';
    }
    
    public init() {
        return;
    }
}

export { TestPlugin as Plugin };
