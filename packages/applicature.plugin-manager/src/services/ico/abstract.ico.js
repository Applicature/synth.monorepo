class AbstractICO {
// eslint-disable-next-line class-methods-use-this,no-unused-vars
    logContribution(network, txHash, amount, params) {
        // @TODO: add contribution to db
    }

// eslint-disable-next-line class-methods-use-this,no-unused-vars
    handleExternalContribution(fromNetwork, fromTxHash, forAddress, amount, params) {
        // @TODO: create transaction for execution
    }

// eslint-disable-next-line class-methods-use-this,no-unused-vars
    listContributions(addresses) {
        // @TODO: list all logged contributions
    }
}

module.exports = AbstractICO;
