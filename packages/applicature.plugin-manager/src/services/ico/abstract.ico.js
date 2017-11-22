class AbstractICO {
    constructor(symbol, decimals) {
        this.symbol = symbol;
        this.decimals = decimals;
    }

// eslint-disable-next-line no-unused-vars,class-methods-use-this
    isValidTxTime(time) {
        // validate if tx is in validity range
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

    getDecimals() {
        return this.decimals;
    }
}

module.exports = AbstractICO;
