import { PluginManager, Service } from '@applicature/multivest.core';

export interface EmailTemplates {
    plainTemplate: string;
    HTMLTemplate?: string;
}

export interface EmailOpts {
    from: string;
    to: string;
    subject: string;
    templateId: string;
    attachments?: object[];
    data: object;
}

export interface templatesStorage {
    [key: string]: EmailTemplates
}

export abstract class EmailService extends Service {

    constructor(pluginManager: PluginManager, private id: number) {
        super(pluginManager);
    }

    public abstract setTemplate(templateId: string, emailTemplates: EmailTemplates): EmailTemplates;

    public abstract getTemplate(templateId: string): EmailTemplates;

    public abstract sendEmail(emailOpts: EmailOpts): Promise<any>;

    public getServiceId(): string {
        return 'email.abstract.service'
    }
}
