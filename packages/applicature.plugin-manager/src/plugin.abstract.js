const { MultivestError } = require('./error');

class Plugin {
    constructor(pluginManager, id = null) {
        this.pluginManager = pluginManager;

        if (id == null) {
            throw new MultivestError('Plugin has id equal null');
        }

        this.id = id;
    }

// eslint-disable-next-line class-methods-use-this
    init() {

    }

// eslint-disable-next-line class-methods-use-this
    getJobs() {
        return {};
    }
}

module.exports = Plugin;
