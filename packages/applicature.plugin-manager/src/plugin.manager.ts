import * as Agenda from 'agenda';
import * as logger from 'winston';
import { Dao, Job, Service } from './entities';
import { MultivestError } from './error';
import { PluginOptions } from './model';
import { Plugin } from './plugin';
import { Constructable, Hashtable } from './structure';

export class PluginManager {
    // @ts-ignore
    protected jobExecutor: Agenda = null;
    private plugins: Hashtable<Plugin<any>> = {};
    private jobs: Hashtable<Job> = {};
    private daos: Hashtable<Dao<any>> = {};
    private services: Hashtable<Service> = {};

    constructor(private pluginList: Array<PluginOptions> = []) {
        logger.debug('creating PluginManager');

        process.on('unhandledRejection', (err) => {
            logger.error('unhandledRejection', err);

            throw err;
        });

        process.on('uncaughtException', (err) => {
            logger.error('uncaughtException', err);

            throw err;
        });
    }

    public setJobExecutor(agenda: Agenda) {
        this.jobExecutor = agenda;
    }

    public getJobExecutor() {
        return this.jobExecutor;
    }

    public getJob(jobId: string) {
        return this.jobs[jobId];
    }

    public getDao(daoId: string) {
        return this.daos[daoId];
    }

    public getDaoByClass<T extends Dao<any>>(expectedDao: Constructable<T>): T {
        const ids = Object.keys(this.daos);

        for (const id of ids) {
            const dao = this.daos[id];

            if (dao instanceof expectedDao) {
                return dao as T;
            }
        }

        throw new MultivestError('UNKNOWN_DAO');
    }

    public registerService(service: Service) {
        this.services[service.getServiceId()] = service;
    }

    public getService(serviceId: string) {
        return this.services[serviceId];
    }

    public getServiceByClass<T extends Service>(expectedService: Constructable<T>): T {
        const ids = Object.keys(this.services);

        for (const id of ids) {
            const service = this.services[id];

            if (service instanceof expectedService) {
                return service as T;
            }
        }

        throw new MultivestError('UNKNOWN_DAO');
    }

    public getServicesByClass(expectedService: typeof Service): Array<Service> {
        const ids = Object.keys(this.services);

        const filteredServices: Array<Service> = [];

        for (const id of ids) {
            const service = this.services[id];

            if (service instanceof expectedService) {
                filteredServices.push(service);
            }
        }

        return filteredServices;
    }

    public getServicesTableByClass(expectedService: typeof Service): Hashtable<Service> {
        const ids = Object.keys(this.services);

        const filteredServices: Hashtable<Service> = {};

        for (const id of ids) {
            const service = this.services[id];

            if (service instanceof expectedService) {
                filteredServices[id] = service;
            }
        }

        return filteredServices;
    }

    public async enableJob(jobId: string, interval: string) {
        if (!Object.prototype.hasOwnProperty.call(this.jobs, jobId)) {
            throw new MultivestError(`PluginManager: Unknown job ${jobId}`);
        }

        if (this.jobs[jobId].enabled) {
            return;
        }

        await this.jobs[jobId].init();
        this.jobExecutor.every(interval, jobId);
        this.jobs[jobId].enabled = true;
    }

    public get(pluginId: string) {
        if (Object.prototype.hasOwnProperty.call(this.plugins, pluginId)) {
            return this.plugins[pluginId];
        }
        throw new MultivestError(`PluginManager: Unknown plugin ${pluginId}`);
    }

    public async init() {
        logger.debug('PluginManager init called');

        const startTime = new Date().getTime();

        try {
            for (const pluginOptions of this.pluginList) {
                logger.debug(`loading plugin ${pluginOptions.path}`);

                try {
                    let pluginInstance;
                    if (pluginOptions && pluginOptions.path) {
                        const PluginClass = require(pluginOptions.path).Plugin;
                        const PluginConstructor = PluginClass as Constructable<Plugin<any>>;
                        pluginInstance = new PluginConstructor(this);
                    } else if (pluginOptions && pluginOptions.pluginClass) {
                        pluginInstance = new pluginOptions.pluginClass(this);
                    }

                    // @ts-ignore
                    this.plugins[pluginInstance.getPluginId()] = pluginInstance;
                }
                catch (error) {
                    logger.error(`PluginManager: Failed to load plugin ${pluginOptions.path}`, error);

                    process.exit(1);
                }
            }

            const pluginIds = Object.keys(this.plugins);

            for (const pluginId of pluginIds) {
                const plugin = this.plugins[pluginId];
                await plugin.init(); // registerService(), servicesClasses.push(ServiceConstructor)
            }

            for (const pluginId of pluginIds) {
                const plugin = this.plugins[pluginId];
                plugin.invoke();
                Object.assign(this.jobs, plugin.getJobs());
                Object.assign(this.daos, await plugin.getDaos());
                Object.assign(this.services, plugin.getServices()); // authService, userService ...
            }

            for (const serviceId in this.services) {
                if (this.services[serviceId]) {
                    await this.services[serviceId].init(); // userService calls authService
                }
            }

            const endTime = new Date().getTime();

            logger.info(`PluginManager: Launched for ${endTime - startTime} ms`);
        }
        catch (error) {
            logger.error('PluginManager: Failed to launch', error);
        }
    }
}
