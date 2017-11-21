class AbstractKyc {
    constructor(pluginManager, id) {
        this.pluginManager = pluginManager;
        this.id = id;
    }

// eslint-disable-next-line class-methods-use-this,no-unused-vars
    validate(userId, fields) {

    }
}

module.exports = AbstractKyc;
