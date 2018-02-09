import { EmailService } from '../../src/service';

export class TestService extends EmailService<string> {
    public getServiceId(): string {
        return 'test.service';
    }

    public async sendEmail(message: string, addressee: string): Promise<any> {
        return {
            status: 'sent',
            addressee: addressee,
        }
    }
}
