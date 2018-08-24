import { PluginManager } from '@applicature-private/multivest.core';
import { Plugin as NodemailerEmailPlugin } from '../../src/plugin';

describe('Nodemailer Plugin', () => {
    test('should init email plugin', async () => {
        const pluginManager: any = new PluginManager();
        await pluginManager.init();
        const Plugin = new NodemailerEmailPlugin(pluginManager);
        await Plugin.init();
    });
    test('should return plugin id', async () => {
        const pluginManager: any = new PluginManager([]);
        await pluginManager.init();
        const Plugin = new NodemailerEmailPlugin(pluginManager);
        await Plugin.init();
        expect(Plugin.getPluginId()).toBe('email.nodemailer');
    });
});
