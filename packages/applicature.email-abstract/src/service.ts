import {Hashtable, PluginManager, Service} from '@applicature/multivest.core';

export interface EmailBodies {
    textBody: string;
    HTMLBody?: string;
}

export interface EmailOpts {
    from: string;
    to: string;
    cc?: Array<string>;
    bcc?: Array<string>;
    headers?: Hashtable<string>;
    subject: string;
    body: EmailBodies;
    attachments?: Array<object>;
}

export abstract class EmailService extends Service {

    constructor(pluginManager: PluginManager, private id: number) {
        super(pluginManager);
    }

    public abstract sendEmail(emailOpts: EmailOpts): Promise<any>;

    public getServiceId(): string {
        return 'email.abstract.service';
    }
}
