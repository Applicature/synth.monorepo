const PluginManager = require('./src/plugin.manager');
const AbstractPlugin = require('./src/plugin.abstract');

const MultivestError = require('./src/error');

module.exports = {
    PluginManager, AbstractPlugin, MultivestError,
};
