import { PluginManager, Service } from '@applicature/multivest.core';

export abstract class EmailService<UserData> extends Service {

    constructor(pluginManager: PluginManager, private id: number) {
        super(pluginManager);
    }

    public abstract sendEmail(message: string, addressee: string): Promise<any>;
}
