import { Job } from './jobs';
import { Hashtable } from './structure';
import { PluginManager } from './plugin.manager';

export class Plugin {
    public path: string;

    constructor(protected pluginManager: PluginManager, public id: string = null) {}

    init(): void {} 

    getJobs(): Hashtable<typeof Job> {
        return {};
    };

    getDao(): Hashtable<any> {
        return {};
    }
}