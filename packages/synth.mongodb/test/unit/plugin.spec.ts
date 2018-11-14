import { MultivestError, PluginManager } from '@applicature/synth.plugin-manager';
import { Plugin as MongodbPlugin } from '../../src/mongodb.plugin';
import { TestDao } from '../mock/dao.mock';

describe('plugin connection', () => {
    let plugin: MongodbPlugin;

    beforeAll(() => {
        const pluginManager = new PluginManager();
        plugin = new MongodbPlugin(pluginManager);
    });

    it('should connect to mongo', async () => {
        await plugin.init();
        expect(plugin.isConnected()).toBeTruthy();
    });

    it('should disconnect properly', async () => {
        await plugin.disconnect();
        expect(plugin.isConnected()).toBeFalsy();
    });

});

describe('db access', () => {
    let plugin: MongodbPlugin;

    beforeAll(() => {
        const pluginManager = new PluginManager([]);
        plugin = new MongodbPlugin(pluginManager);
    });

    it('should reject with error while disconnected', async () => {
        try {
            await plugin.getDB();
        }
        catch (e) {
            expect(e).toBeInstanceOf(MultivestError);
        }
    });

});

describe('plugin dao actions', () => {
    let plugin: MongodbPlugin;

    beforeEach(() => {
        const pluginManager = new PluginManager([]);
        plugin = new MongodbPlugin(pluginManager);
    });

    it('should throw error on getDaos() if disconnected', async () => {
        try {
            await plugin.getDaos();
        }
        catch (e) {
            expect(e).toBeInstanceOf(MultivestError);
        }
    });

    it('should register dao while disconnected', async () => {
        plugin.addDao(TestDao);
        await plugin.init();
        plugin.invoke();
        const daos = await plugin.getDaos();
        expect(Object.prototype.hasOwnProperty.call(daos, 'test.dao')).toBeTruthy();
    });

    it('should add dao if connected', async () => {
        await plugin.init();
        plugin.addDao(TestDao);
        plugin.invoke();
        const daos = await plugin.getDaos();
        expect(Object.prototype.hasOwnProperty.call(daos, 'test.dao')).toBeTruthy();
    });

    it('should get one dao', async () => {
        plugin.addDao(TestDao);
        await plugin.init();
        plugin.invoke();
        const dao = await plugin.getDao('test.dao');
        expect(dao).toBeInstanceOf(TestDao);
    });
});
