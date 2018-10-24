import {PluginManager} from '@applicature/synth.plugin-manager';
import { TestService } from '../mocks/service';

describe('email abstract service', () => {
    it('should create service', async () => {
        const service = new TestService({} as PluginManager);
        const result = await service.sendEmail({
            body: 'message',
            to: 'example@gmail.com',
        } as any);

        expect(service.getServiceId()).toBe('test.service');
        expect(result).toHaveProperty('status', 'sent');
    });
});
