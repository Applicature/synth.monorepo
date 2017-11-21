class AbstractICO {
    constructor(symbol) {
        this.symbol = symbol;
    }

// eslint-disable-next-line class-methods-use-this,no-unused-vars
    logContribution(network, uniqId, txHash, amount, params) {
        // add contribution to db
    }

// eslint-disable-next-line class-methods-use-this,no-unused-vars
    handleExternalContribution(uniqId, parentTx, icoAddressId, userAddress, tokens, status, at) {
        // create transaction for execution
    }

// eslint-disable-next-line class-methods-use-this,no-unused-vars
    listContributions(addresses) {
        // list all logged contributions
    }

// eslint-disable-next-line class-methods-use-this
    getStats() {
        // get stats
    }

// eslint-disable-next-line class-methods-use-this
    getSymbol() {
        return this.symbol;
    }
}

module.exports = AbstractICO;
