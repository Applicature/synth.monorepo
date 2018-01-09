import * as Agenda from 'agenda';
import * as logger from 'winston';
import { MultivestError } from './error';
import { Plugin } from './plugin';
import { Dao, Constructable, Hashtable } from './structure';
import { Job } from './jobs';
import { ICOServise } from './services/ico';
import { ExchangeServise } from './services/exchange';

export class PluginManager {
    private ICOServise: ICOServise = null;
    private exchangeServise: ExchangeServise = null;

    private plugins: Hashtable<Plugin<any>> = {};
    private jobs: Hashtable<Job> = {};
    private daos: Hashtable<Dao<any>> = {};

    constructor(private pluginList: Plugin<any>[] = []) {
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

        if (Object.prototype.hasOwnProperty.call(this.jobs, jobId)) {
            return;
        }

        await this.jobs[jobId].init();
        jobExecutor.every(interval, jobId);
        this.jobs[jobId].enabled = true;
    }

    get(pluginId: string) {
        if (Object.prototype.hasOwnProperty.call(this.plugins, pluginId)) {
            return this.plugins[pluginId];
        }
        throw new MultivestError(`PluginManager: Unknown plugin ${pluginId}`);
    }

    async init() {
        logger.debug('PluginManager init called');

        const startTime = new Date().getTime();

        try {
            for (const pluginOptions of this.pluginList) {
                logger.debug(`loading plugin ${pluginOptions.path}`);

                try {
                    const PluginClass = require(pluginOptions.path).Plugin;
                    const PluginConstructor = PluginClass as Constructable<Plugin<any>>;
                    const pluginInstance = new PluginConstructor(this);
                    this.plugins[pluginInstance.getPluginId()] = pluginInstance;
                }
                catch (error) {
                    logger.error(`PluginManager: Failed to load plugin ${pluginOptions.path}`, error);

                    process.exit(1);
                }
            }

            for (const pluginId of Object.keys(this.plugins)) {
                const plugin = this.plugins[pluginId];
                await plugin.init();
                plugin.invoke();
                Object.assign(this.jobs, plugin.getJobs());
                Object.assign(this.daos, plugin.getDaos());
            }

            const endTime = new Date().getTime();

            logger.info(`PluginManager: Launched for ${endTime - startTime} ms`);
        }
        catch (error) {
            logger.error('PluginManager: Failed to launch', error);
        }
    }
}