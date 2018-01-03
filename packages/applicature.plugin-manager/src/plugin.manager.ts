import * as Agenda from 'agenda';
import * as logger from 'winston';
import { MultivestError } from './error';
import { Plugin } from './plugin';
import { Hashtable } from './structure';
import { Job } from './jobs';
import { ICOServise } from './services/ico';
import { ExchangeServise } from './services/exchange';

export class PluginManager {
    private jobs: Hashtable<typeof Job> = {};
    private enabledJobs: Hashtable<Job> = {};

    private ICOServise: ICOServise = null;
    private exchangeServise: ExchangeServise = null;

    private launchedPlugins: Plugin[] = [];
    private pluginsRegistry: Hashtable<Plugin> = {};

    constructor(private plugins: Plugin[] = []) {
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

    getIco() {
        return this.ICOServise;
    }

    setIco(ico: ICOServise) {
        this.ICOServise = ico;
    }

    getExchange() {
        return this.exchangeServise;
    }

    setExchange(exchange: ExchangeServise) {
        this.exchangeServise = exchange;
    }

    async enableJob(jobId: string, jobExecutor: Agenda, interval: string) {
        if (!Object.prototype.hasOwnProperty.call(this.jobs, jobId)) {
            throw new MultivestError(`PluginManager: Unknown job ${jobId}`);
        }

        if (Object.prototype.hasOwnProperty.call(this.enabledJobs, jobId)) {
            return;
        }

        const JobConstructor = this.jobs[jobId] as typeof Job;

        this.enabledJobs[jobId] = new JobConstructor(this, jobExecutor, jobId);

        await this.enabledJobs[jobId].init();

        jobExecutor.every(interval, jobId);

        this.enabledJobs[jobId].enabled = true;
    }

    addJob(jobId: string, job: typeof Job) {
        this.jobs[jobId] = job;
    }

    get(pluginId: string) {
        if (Object.prototype.hasOwnProperty.call(this.pluginsRegistry, pluginId)) {
            return this.pluginsRegistry[pluginId];
        }

        throw new MultivestError(`PluginManager: Unknown plugin ${pluginId}`);
    }

    async init() {
        logger.debug('PluginManager init called');

        const startTime = new Date().getTime();

        try {
            for (const plugin of this.plugins) {
                logger.debug(`loading plugin ${plugin.path}`);

                try {
                    const PluginConstructor = require(plugin.path).Plugin as typeof Plugin;

                    const launchedPlugin = new PluginConstructor(this);

                    this.pluginsRegistry[launchedPlugin.id] = launchedPlugin;

                    const jobs = launchedPlugin.getJobs();

                    if (jobs) {
                        for (const jobId of Object.keys(jobs)) {
                            this.addJob(jobId, jobs[jobId]);
                        }
                    }

                    this.launchedPlugins.push(launchedPlugin);
                }
                catch (error) {
                    logger.error(`PluginManager: Failed to load plugin ${plugin.path}`, error);

                    process.exit(1);
                }
            }

            for (const plugin of this.launchedPlugins) {
                await plugin.init();
            }

            const endTime = new Date().getTime();

            logger.info(`PluginManager: Launched for ${endTime - startTime} ms`);
        }
        catch (error) {
            logger.error('PluginManager: Failed to launch', error);
        }
    }
}

module.exports = PluginManager;
