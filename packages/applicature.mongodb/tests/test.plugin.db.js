// eslint-disable-next-line no-undef

const assert = require('assert');

const PluginDb = require('../plugin.db');

// eslint-disable-next-line no-undef
describe('plugin.db', () => {
// eslint-disable-next-line no-undef
    it('create plugin db', () => {
        const pluginDb = new PluginDb();

        assert.equal(pluginDb.urls, 'mongodb://localhost/multivest');
    });
});
