import * as Agenda from 'agenda';
import { Dao, Job, Service } from './entities';
import { PluginManager } from './plugin.manager';
import { Constructable, Hashtable } from './structure';

export abstract class Plugin<T> {
    public path: string;
    protected jobClasses: Array<typeof Job> = [];
    protected jobs: Hashtable<Job> = {};
    protected daoClasses: Array<typeof Dao> = [];
    protected daos: Hashtable<Dao<T>> = {};
    protected serviceClasses: Array<typeof Service> = [];
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
            const daoInstance = new DaoConstructor();
            this.daos[daoInstance.getDaoId()] = daoInstance;
        }

        for (const ServiceClass of this.serviceClasses) {
            const ServiceConstructor = ServiceClass as Constructable<Service>;
            const serviceInstance = new ServiceConstructor(this.pluginManager);
            this.services[serviceInstance.getServiceId()] = serviceInstance;
        }
    }

    public registerDao(daoClass: typeof Dao) {
        this.daoClasses.push(daoClass);
    }

    public getDaos() {
        return this.daos;
    }

    public registerJob(jobClass: typeof Job) {
        this.jobClasses.push(jobClass);
    }

    public getJobs() {
        return this.jobs;
    }

    public registerService(serviceClass: typeof Service) {
        this.serviceClasses.push(serviceClass);
    }

    public getServices() {
        return this.services;
    }
}
