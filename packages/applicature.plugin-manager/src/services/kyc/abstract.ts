import { PluginManager } from '../../plugin.manager';
import { KYCStatus } from './model';

export abstract class KYCService<T> {
    public status: KYCStatus;

    constructor(private pluginManager: PluginManager, private id: number) {}

    public abstract validate(data: T): boolean;
}
