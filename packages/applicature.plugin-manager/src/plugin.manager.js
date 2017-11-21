const logger = require('winston');

const { MultivestError } = require('./error');

class PluginManager {
    constructor(plugins = []) {
        logger.debug('creating PluginManager');

        this.plugins = plugins;

        this.launchedPlugins = [];
        this.pluginsRegistry = {};

        process.on('unhandledRejection', (err) => {
            logger.error('unhandledRejection', err);

            throw err;
        });

        process.on('uncaughtException', (err) => {
            logger.error('uncaughtException', err);

            throw err;
        });
    }

    get(pluginId) {
        if (Object.prototype.hasOwnProperty.call(this.pluginsRegistry, pluginId)) {
            return this.pluginsRegistry[pluginId];
        }

        throw new MultivestError(`Unknown plugin ${pluginId}`);
    }

    async init() {
        logger.debug('PluginManager init called');

        const startTime = new Date().getTime();

        try {
            // eslint-disable-next-line no-restricted-syntax
            for (const plugin of this.plugins) {
                logger.debug(`loading plugin ${plugin.id}`);

                // eslint-disable-next-line import/no-dynamic-require,global-require
                const { Plugin } = require(plugin.path);

                const launchedPlugin = new Plugin(this);

                this.pluginsRegistry[launchedPlugin.id] = launchedPlugin;

                this.launchedPlugins.push(launchedPlugin);
            }

            // eslint-disable-next-line no-restricted-syntax
            for (const plugin of this.launchedPlugins) {
                // eslint-disable-next-line no-await-in-loop
                await plugin.init();
            }

            const endTime = new Date().getTime();

            logger.info(`Launched for ${endTime - startTime} ms`);
        }
        catch (error) {
            logger.error('Failed to launch', error);
        }
    }
}

module.exports = PluginManager;
