import { PluginManager, Service } from '@applicature/multivest.core';

export interface EmailBodies {
    textBody: string;
    HTMLBody?: string;
}

export interface EmailOpts {
    from: string;
    to: string;
    subject?: string;
    emailBodyId: string;
    attachments?: object[];
}

export interface EmailBodiesStorage {
    [key: string]: EmailBodies
}

export abstract class EmailService extends Service {

    constructor(pluginManager: PluginManager, private id: number) {
        super(pluginManager);
    }

    public abstract setTemplate(emailBodyId: string, emailBody: EmailBodies): EmailBodies;

    public abstract getTemplate(emailBodyId: string): EmailBodies;

    public abstract sendEmail(emailOpts: EmailOpts): Promise<any>;

    public getServiceId(): string {
        return 'email.abstract.service'
    }
}
