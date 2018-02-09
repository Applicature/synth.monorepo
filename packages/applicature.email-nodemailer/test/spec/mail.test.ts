import {NodeMailerEmailService} from '../../src/service';

import {EmailOpts, EmailBodies} from '@applicature/multivest.email.abstract/dist';
import {PluginManager} from '@applicature/multivest.core';

describe('test', () => {
    it('should work', async () => {
        const pluginManager: any = new PluginManager();

        const service: NodeMailerEmailService = new NodeMailerEmailService(pluginManager);

        const emailOpts: EmailOpts = {
            from: 'test@exmplae.com',
            to: 'test-to@exmplae.com',
            cc: ['copy-1@example.com'],
            replyTo: 'reply-to@example.com',
            inReplyTo: 'in-reply-to',
            subject: 'test-subject',
            body: {HTMLBody: '<b>Hello world</b>', textBody: 'Hello world!'},
        };

        const result = await service.sendEmail(emailOpts);

        expect(result.messageId).toBeTruthy();
    });
});
