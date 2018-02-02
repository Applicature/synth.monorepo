import { TestPlugin } from '../mocks/plugin';
import { TestService } from '../mocks/service';

import { Constructable, Service } from '@applicature/multivest.core';

describe('email abstract plugin', () => {
    it('should create plugin', () => {
        const plugin = new TestPlugin(null);
        plugin.registerService(TestService as Constructable<Service>);
        plugin.init();
        plugin.invoke();
        const services = plugin.getServices();
        expect(services['test.service']).toBeTruthy();
    });
});
