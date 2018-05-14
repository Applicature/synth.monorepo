import { Dao, Job, Service } from './entities';
import { PluginManager } from './plugin.manager';
import { Constructable, Hashtable } from './structure';

export abstract class Plugin<T> {
    public path: string;
    protected jobClasses: Array<Constructable<Job>> = [];
    protected jobs: Hashtable<Job> = {};
    protected daoClasses: Array<Constructable<Dao<T>>> = [];
    protected daos: Hashtable<Dao<T>> = {};
    protected serviceClasses: Array<Constructable<Service>> = [];
    protected services: Hashtable<Service> = {};

    constructor(protected pluginManager: PluginManager) {}

    public abstract getPluginId(): string;
    public abstract init(): void;

    public invoke(): void {
        for (const JobClass of this.jobClasses) {
            const JobConstructor = JobClass as Constructable<Job>;
            const jobInstance = new JobConstructor(this.pluginManager);
            this.jobs[jobInstance.getJobId()] = jobInstance;
        }

        for (const DaoClass of this.daoClasses) {
            const DaoConstructor = DaoClass as Constructable<Dao<T>>;
            const daoInstance = this.invokeDao(DaoConstructor);
            this.daos[daoInstance.getDaoId()] = daoInstance;
        }

        for (const ServiceClass of this.serviceClasses) {
            const ServiceConstructor = ServiceClass as Constructable<Service>;
            const serviceInstance = new ServiceConstructor(this.pluginManager);
            this.services[serviceInstance.getServiceId()] = serviceInstance;
        }
    }

    public registerDao(daoClass: Constructable<Dao<T>>): void {
        this.daoClasses.push(daoClass);
    }

    public async getDaos() {
        return this.daos;
    }

    public registerJob(jobClass: Constructable<Job>): void {
        this.jobClasses.push(jobClass);
    }

    public getJobs() {
        return this.jobs;
    }

    public registerService(serviceClass: Constructable<Service>): void {
        this.serviceClasses.push(serviceClass);
    }

    public getServices() {
        return this.services;
    }

    protected invokeDao(DaoConstructor: Constructable<Dao<T>>): Dao<T> {
        return new DaoConstructor();
    }
}
