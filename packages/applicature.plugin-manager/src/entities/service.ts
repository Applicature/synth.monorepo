import { PluginManager } from '../plugin.manager';

export abstract class Service {

    constructor(protected pluginManager: PluginManager) {}
    public abstract getServiceId(): string;
    public async init(): Promise<void> {
        return;
    }
}
