import EmailService from '../../src/service';
import {EmailOpts} from '@applicature/multivest.email.abstract/dist';
import {EmailBodies} from '@applicature/multivest.email.abstract/src/service';

describe('test', () => {
    it('should work', async () => {
        const service: EmailService = new EmailService();
        const emailOpts: EmailOpts = new EmailOpts({
            from: "test@exmplae.com",
            to: "test-to@exmplae.com",
            cc: ["copy-1@example.com"],
            replyTo: "reply-to@example.com",
            inReplyTo: "in-reply-to",
            subject: "test-subject",
            body: new EmailBodies("<b>Hello world</b>", "Hello world!"),
        });

        const result = await service.sendEmail(emailOpts);

        console.log(result);

        expect(1).toBe(1);
    });
});
