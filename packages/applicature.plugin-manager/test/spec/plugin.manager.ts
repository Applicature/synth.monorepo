import { expect } from 'chai';
import { MultivestError, Plugin, PluginManager } from '../../index';

describe('Plugin Manager', () => {
    const manager = new PluginManager([
        {
            path: '../plugin/test.plugin',
        },
    ]);

    it('Should return plugin', () => {
        expect(manager.get('test.plugin')).to.be.instanceOf(Plugin);
    });

});
