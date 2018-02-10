import {EmailOpts} from '@applicature/multivest.email.abstract/src/service';
import * as nodemailer from 'nodemailer';

import { PluginManager } from '@applicature/multivest.core';
import { EmailService } from '@applicature/multivest.email.abstract';

import * as config from 'config';

export class NodeMailerEmailService extends EmailService {
    private transporter: any;

    constructor(pluginManager: PluginManager) {
        super(pluginManager);

        this.transporter = nodemailer.createTransport(config.get('email.nodemailer'));
    }

    public getServiceId() {
        return 'nodemailer.email.service';
    }

    public sendEmail(emailOpts: EmailOpts): Promise<any> {
        const mail = {
            from: emailOpts.from,
            to: emailOpts.to,

            bcc: emailOpts.bcc,
            cc: emailOpts.cc,

            subject: emailOpts.subject,

            html: emailOpts.body.HTMLBody,
            text: emailOpts.body.textBody,

            inReplyTo: emailOpts.inReplyTo,
            replyTo: emailOpts.replyTo,

            messageId: emailOpts.messageId,
        };

        return new Promise((resolve, reject) => {
            this.transporter.sendMail(mail, (error: any, info: any) => {
                // @TODO: map error & info

                if (error) {
                    return reject(error);
                }

                resolve(info);
            });
        });
    }
}
