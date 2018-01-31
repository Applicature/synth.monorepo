import { Plugin } from '../../src/plugin';

export class EmptyPlugin extends Plugin<void> {

    public getPluginId() {
        return 'empty.plugin';
    }

    public init() {
        return;
    }
}
