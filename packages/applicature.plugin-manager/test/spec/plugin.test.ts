
import { Plugin } from '../../src/plugin';
import { TestDao } from '../mocks/dao';
import { EmptyPlugin } from '../mocks/empty.plugin';
import { TestJob } from '../mocks/job';
import { PluginManagerMock } from '../mocks/plugin.manager';
import { TestService } from '../mocks/service';
import { Dao } from '../../src/entities/dao';
describe('plugin', () => {

    let plugin: Plugin<void>;
    beforeEach(() => {
        const pluginManagerMock: any = new PluginManagerMock(jest.fn());
        plugin = new EmptyPlugin(pluginManagerMock);
    });

    it('should add job', () => {
        plugin.registerJob(TestJob);
        plugin.invoke();
        const jobs = plugin.getJobs();
        expect(jobs['test.job']).toBeInstanceOf(TestJob);
    });
    
    it('should add dao', async () => {
        plugin.registerDao(TestDao);
        plugin.invoke();
        const daos = await plugin.getDaos();
        expect(daos['test.dao']).toBeInstanceOf(TestDao);
    });
    
    it('should register service', () => {
        plugin.registerService(TestService);
        plugin.invoke();
        const services = plugin.getServices();
        expect(services['test.service']).toBeInstanceOf(TestService);
    });
});
