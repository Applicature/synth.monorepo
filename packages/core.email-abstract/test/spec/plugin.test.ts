import { TestPlugin } from '../mocks/plugin';
import { TestService } from '../mocks/service';

import {Constructable, PluginManager, Service} from '@applicature/synth.plugin-manager';

describe('email abstract plugin', () => {
    it('should create plugin', () => {
        const plugin = new TestPlugin({} as PluginManager);
        plugin.registerService(TestService as Constructable<Service>);
        plugin.init();
        plugin.invoke();
        const services = plugin.getServices();
        expect(services['test.service']).toBeTruthy();
    });
});
