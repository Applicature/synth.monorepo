import { TestService } from '../mocks/service';

describe('email abstract service', () => {
    it('should create service', async () => {
        const service = new TestService(null, null);
        const result = await service.sendEmail('Hello', 'samosvatov@gmail.com');
        expect(service.getServiceId()).toBe('test.service');
        expect(result).toHaveProperty('status', 'sent');
    });
});
