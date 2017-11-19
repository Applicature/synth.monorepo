const logger = require('winston');

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

    init() {
        logger.debug('PluginManager init called');

        const startTime = new Date().getTime();

// eslint-disable-next-line no-restricted-syntax
        for (const plugin of this.plugins) {
            logger.debug(`loading plugin ${plugin.id}`);

// eslint-disable-next-line import/no-dynamic-require,global-require
            const LoadedPlugin = require(plugin.path);

            const launchedPlugin = new LoadedPlugin(this);

            this.pluginsRegistry[launchedPlugin.id] = launchedPlugin;

            this.launchedPlugins.push(launchedPlugin);
        }

        let promise = Promise.resolve();

// eslint-disable-next-line no-restricted-syntax
        for (const plugin of this.launchedPlugins) {
            promise = promise.then(plugin.init);
        }

        return promise
            .then(() => {
                const endTime = new Date().getTime();

                logger.info(`Launched for ${endTime - startTime} ms`);
            })
            .catch(err => logger.error('Failed', err));
    }
}

module.exports = PluginManager;
