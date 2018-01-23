import { Service } from '../../entities/service';
import { PluginManager } from '../../plugin.manager';

export enum KYCStatus {
    ACCEPTED,
    DECLINED,
    REVIEW,
    IN_PROGRESS,
}

export abstract class KYCService<UserData> extends Service {

    constructor(pluginManager: PluginManager, private id: number) {
        super(pluginManager);
    }

    public abstract validate(data: UserData): Promise<{status: KYCStatus, txId: string}>;
    public abstract checkValidation(txId: string): Promise<KYCStatus>;
}
