import { EmailOpts, EmailService } from '../../src/service';

export class TestService extends EmailService {
    public getServiceId(): string {
        return 'test.service';
    }

    public async sendEmail(opts: EmailOpts): Promise<any> {
        return {
            addresses: opts.to,
            status: 'sent',
        };
    }
}
