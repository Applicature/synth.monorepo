import { PluginManager } from '../../plugin.manager';
import { KYCStatus } from './model';

export abstract class KYCService<T> {

    constructor(private pluginManager: PluginManager, private id: number) {}

    public abstract validate(data: T): Promise<KYCStatus>;
}
