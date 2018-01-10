import * as Agenda from 'agenda';
import { Job } from './jobs';
import { Constructable, Dao, Hashtable } from './structure';
import { PluginManager } from './plugin.manager';

export abstract class Plugin<T> {
    public path: string;
    protected jobClasses: Array<typeof Job> = [];
    protected jobs: Hashtable<Job> = {};
    protected daoClasses: Array<typeof Dao> = [];
    protected daos: Hashtable<Dao<T>> = {};

    constructor(protected pluginManager: PluginManager) {}

    abstract getPluginId(): string;
    abstract init(): void;

    invoke(): void {
        const jobExecutor = this.pluginManager.getExecutor();
        for (const JobClass of this.jobClasses) {
            const JobConstructor = JobClass as Constructable<Job>;
            const jobInstance = new JobConstructor(jobExecutor);
            this.jobs[jobInstance.getJobId()] = jobInstance;
        }

        for (const DaoClass of this.daoClasses) {
            const DaoConstructor = DaoClass as Constructable<Dao<T>>;
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