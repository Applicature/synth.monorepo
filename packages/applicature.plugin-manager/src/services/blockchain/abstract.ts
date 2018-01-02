abstract class AbstractBlockchain<T> {
    getNetworkId() {

    }

    getSymbol() {

    }

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

    getBlockNumber(block) {
        return 0;
    }

    getBlockTimestamp(block) {
        return 0;
    }
}

module.exports = AbstractBlockchain;
