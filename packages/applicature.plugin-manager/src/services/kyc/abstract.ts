import { Service } from '../../entities/service';
import { PluginManager } from '../../plugin.manager';
import { KYCStatus } from './model';

export abstract class KYCService<T> extends Service {

    constructor(pluginManager: PluginManager, private id: number) {
        super(pluginManager);
    }

    public abstract validate(data: T): Promise<KYCStatus>;
}
