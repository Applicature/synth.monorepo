
import { MultivestError } from '../../src/error';
import { PluginManager } from '../../src/plugin.manager';

describe('plugin manager', () => {

    it('should fail', () => {
        expect(1).toBe(2);
    });

    it('should init empty plugin manager', () => {
        const pluginManager = new PluginManager();
        pluginManager.init();
    });

    it('should init plugin manager with one plugin', async () => {
        const pluginManager = new PluginManager([{
            path: '../test/mocks/plugin',
        }]);
        const jobExecutor: any = {
            define: jest.fn(),
            every: jest.fn(),
        };
        pluginManager.setJobExecutor(jobExecutor);
        expect(pluginManager.getJobExecutor()).toBe(jobExecutor);
        await pluginManager.init();
        expect(jobExecutor.define).toHaveBeenCalledTimes(1);

        const plugin = pluginManager.get('test.plugin');
        expect(plugin).toBeTruthy();

        const job = pluginManager.getJob('test.job');
        expect(job).toBeTruthy();
        expect(job.enabled).toBeFalsy();
        await pluginManager.enableJob('test.job', '1 minute');
        expect(jobExecutor.every).toHaveBeenCalledTimes(1);
        expect(jobExecutor.every).toHaveBeenCalledWith('1 minute', 'test.job');

        await pluginManager.enableJob('test.job', '1 minute');
        expect(jobExecutor.every).toHaveBeenCalledTimes(1);

        expect(pluginManager.getDao('test.dao')).toBeTruthy();
        expect(pluginManager.getService('test.service')).toBeFalsy();
    });

    it('should throw error on unknown plugin', () => {
        const pluginManager = new PluginManager();
        pluginManager.init();

        expect(() => {
            pluginManager.get('plugin');
        }).toThrowError(MultivestError);
    });

    it('should throw error on unknown job', async () => {
        const pluginManager = new PluginManager();
        pluginManager.init();
        expect.assertions(1);

        try {
            await pluginManager.enableJob('job', '1 minute');
        } catch (err) {
            expect(err).toBeInstanceOf(MultivestError);
        }
    });

});
