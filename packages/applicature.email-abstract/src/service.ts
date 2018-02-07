import { PluginManager, Service } from '@applicature/multivest.core';

export interface emailTemplates {
    plainTemplate: string;
    HTMLTemplate?: string;
}

export interface emailOpts {
    from: string;
    to: string;
    subject: string;
    templateId: string;
    attachments?: object[];
    data: object;
}

export interface templatesStorage {
    [key: string]: emailTemplates
}

export abstract class EmailService extends Service {

    constructor(pluginManager: PluginManager, private id: number) {
        super(pluginManager);
    }

    public abstract setTemplate(templateId: string, emailTemplates: emailTemplates): emailTemplates;

    public abstract getTemplate(templateId: string): emailTemplates;

    public abstract sendEmail(emailOpts: emailOpts): Promise<any>;

    public getServiceId(): string {
        return 'email.abstract.service'
    }
}
