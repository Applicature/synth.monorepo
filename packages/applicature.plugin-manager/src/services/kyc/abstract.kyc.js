class AbstractKyc {
    constructor(pluginManager, id) {
        this.pluginManager = pluginManager;
        this.id = id;
    }

// eslint-disable-next-line class-methods-use-this,no-unused-vars,max-len
    validate(userId, firstName, lastName, dateOfBirth, country, state, city, streetAddress, apartment, zipCode, fields) {

    }
}

module.exports = AbstractKyc;
