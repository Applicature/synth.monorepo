import * as Agenda from 'agenda';
import { Job } from './jobs';
import { Constructable, CompositeDao, Dao, Hashtable } from './structure';
import { PluginManager } from './plugin.manager';

export abstract class Plugin<T extends CompositeDao<T>> {
    public path: string;
    private jobClasses: Array<typeof Job> = [];
    private jobs: Hashtable<Job> = {};
    private daoClasses: Array<typeof Dao> = [];
    private daos: Hashtable<Dao<T>> = {};

    constructor(protected pluginManager: PluginManager) {}

    abstract getPluginId(): string;

    invoke(): void {
        for (const JobClass of this.jobClasses) {
            const JobConstructor = JobClass as Constructable<Job>;
            const jobInstance = new JobConstructor(this.pluginManager.jobExecutor);
            this.jobs[jobInstance.getJobId()] = jobInstance;
        }

        for (const DaoClass of this.daoClasses) {
            const DaoConstructor = DaoClass as CompositeDao<T>;
            const daoInstance = new DaoConstructor();
            this.daos[daoInstance.getDaoId()] = daoInstance;
        }
    }
 
    registerDao(daoClass: typeof Dao) {
        this.daoClasses.push(daoClass);
    }

    getDaos() {
        return this.daos;
    };

    registerJob(jobClass: typeof Job) {
        this.jobClasses.push(jobClass);
    }

    getJobs() {
        return this.jobs;
    };
}