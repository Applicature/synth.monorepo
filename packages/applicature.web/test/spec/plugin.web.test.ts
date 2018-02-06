import * as config from 'config';
import * as express from 'express';

import { Plugin as WebPlugin } from '../../src/plugin.web';
import { PluginManagerMock } from '../mocks/plugin.manager';

describe('Web Plugin', () => {
    test('should init web plugin', () => {
        const pluginManager: any = new PluginManagerMock(jest.fn());
        const web = new WebPlugin(pluginManager);
        web.init();
    });
    test('should return plugin id', () => {
        const pluginManager: any = new PluginManagerMock(jest.fn());
        const web = new WebPlugin(pluginManager);
        expect(web.getPluginId()).toBe('web');
    });
    test('should add Routes', () => {
        const pluginManager: any = new PluginManagerMock(jest.fn());
        const app = express();
        const web = new WebPlugin(pluginManager, config, app);
        const router = express.Router();
        web.addRouter('one', router);
    });
    test('should enable Router', () => {
        const pluginManager: any = new PluginManagerMock(jest.fn());
        const app = express();
        const web = new WebPlugin(pluginManager, config, app);
        const router = express.Router();
        web.addRouter('one', router);
        web.enableRouter('one');
    });
    test('should start Server', () => {
        const pluginManager: any = new PluginManagerMock(jest.fn());
        const app = express();
        const web = new WebPlugin(pluginManager, config, app);
        web.startServer();
        web.closeServer();
    });
});
