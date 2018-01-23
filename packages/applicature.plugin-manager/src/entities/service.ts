import { PluginManager } from '../plugin.manager';

export abstract class Service {

    constructor(protected pluginManager: PluginManager) {}
    public abstract getServiceId(): string;
}
