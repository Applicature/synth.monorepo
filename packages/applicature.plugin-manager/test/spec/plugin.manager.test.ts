
import { PluginManager } from '../../src/plugin.manager';

describe('plugin manager', () => {
    let pluginManager: PluginManager;

    beforeEach(() => {
        pluginManager = new PluginManager();
    });

    it('should init plugin manager', () => {
        pluginManager.init();
    });
});
