import { EmailPlugin } from '../../src/plugin';

export class TestPlugin extends EmailPlugin {
    public getPluginId() {
        return 'test.plugin';
    }

    public init() {
        return;
    }
}
