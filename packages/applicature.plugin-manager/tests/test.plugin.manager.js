// eslint-disable-next-line no-undef

const PluginManager = require('../src/plugin.manager');

// eslint-disable-next-line no-undef
describe('plugin.manager', () => {
    it('import index', () => {
        require('../index');
    });

// eslint-disable-next-line no-undef
    it('create plugin manager', () => {
        const pluginManager = new PluginManager();
    });
});
