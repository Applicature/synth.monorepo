/* eslint-disable no-unused-vars,class-methods-use-this,no-empty-function */
class AbstractBlockchain {
    getHDAddress(index) {

    }

    isValidAddress(address) {

    }

    async getBlockHeight() {

    }

    async getBlockByHeight(blockHeight) {

    }

    async getTransactionByHash(txHash) {

    }

    async sendTransaction(from, to, amount, fee) {

    }

    async sendRawTransaction(txHex) {

    }

    async getBalance(address, minConf = 1) {

    }
}

module.exports = AbstractBlockchain;
