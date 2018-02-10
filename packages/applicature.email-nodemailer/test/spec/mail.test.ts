import {PluginManager} from '@applicature/multivest.core';
import {EmailOpts} from '@applicature/multivest.email.abstract/dist';
import {NodeMailerEmailService} from '../../src';

describe('test', () => {
    it('should work', async () => {
        const pluginManager: any = new PluginManager();

        const service: NodeMailerEmailService = new NodeMailerEmailService(pluginManager);

        const emailOpts: EmailOpts = {
            body: {HTMLBody: '<b>Hello world</b>', textBody: 'Hello world!'},
            cc: ['copy-1@example.com'],
            from: 'test@exmplae.com',
            inReplyTo: 'in-reply-to',
            replyTo: 'reply-to@example.com',
            subject: 'test-subject',
            to: 'test-to@exmplae.com',
        };

        const result = await service.sendEmail(emailOpts);

        expect(result.messageId).toBeTruthy();
    });
});
