
import { Plugin } from '../../src/plugin';
import { TestDao } from '../mocks/dao';
import { EmptyPlugin } from '../mocks/empty.plugin';
import { TestJob } from '../mocks/job';
import { PluginManagerMock } from '../mocks/plugin.manager';
import { TestService } from '../mocks/service';

describe('plugin', () => {

    let plugin: Plugin<void>;
    beforeEach(() => {
        const pluginManagerMock = new PluginManagerMock(jest.fn());
        plugin = new EmptyPlugin(pluginManagerMock);
    });

    it('should add job', () => {
        plugin.registerJob(TestJob);
        plugin.invoke();
        const jobs = plugin.getJobs();
        expect(jobs['test.job'] instanceof TestJob).toBeTruthy();
    });
    
    it('should add dao', () => {
        plugin.registerDao(TestDao);
        plugin.invoke();
        const daos = plugin.getDaos();
        expect(daos['test.dao'] instanceof TestDao).toBeTruthy();
    });
    
    it('should register service', () => {
        const testService = new TestService();
        plugin.registerService(testService);
        const services = plugin.getServices();
        expect(services['test.service']).toBe(testService);
    });
});
