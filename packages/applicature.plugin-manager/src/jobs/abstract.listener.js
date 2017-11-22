const logger = require('winston');
const BigNumber = require('bignumber.js');

const AbstractJob = require('./abstract.job');
const MultivestError = require('../error');

class AbstractBlockchainListener extends AbstractJob {
    // eslint-disable-next-line max-len
    constructor(pluginManager, jobExecutor, jobId, jobTitle, blockchainService, sinceBlock, minConfirmations = 0) {
        super(jobExecutor, jobId, jobTitle);

        this.pluginManager = pluginManager;
        this.blockchain = blockchainService;

        this.minConfirmation = minConfirmations;
        this.sinceBlock = sinceBlock;

        jobExecutor.define(this.jobId, async (job, done) => {
            logger.info(`${this.jobTitle}: executing job`);

            try {
                await this.execute();

                done();
            }
            catch (err) {
                logger.error(`${this.jobTitle} failed to process blocks`, err);

                done(err);
            }
        });
    }

    async init() {
        this.dao = await this.pluginManager.get('mongodb').getDao();
    }

    async execute() {
        let job = await this.dao.jobs.getJob(this.jobId);

        if (!job) {
            job = await this.dao.jobs.insertJob({
                job: this.jobId,
                processedBlockHeight: this.sinceBlock,
            });
        }

        const processedBlockHeight = job.processedBlockHeight;

        let processingBlock;

        if (processedBlockHeight) {
            processingBlock = (new BigNumber(processedBlockHeight).add(1)).toNumber();
        }
        else {
            processingBlock = (new BigNumber(this.sinceBlock).add(1)).toNumber();
        }

        const publicBlockHeight = await this.blockchain.getBlockHeight();

        await this.processBlocks(job, processingBlock, publicBlockHeight);
    }

    async processBlocks(job, processSinceBlock, publishedBlockHeight) {
        logger.info(`${this.jobTitle}: processing blocks`, {
            processSinceBlock,
            publishedBlockHeight,
        });

// eslint-disable-next-line max-len
        for (let processingBlock = processSinceBlock; processingBlock < publishedBlockHeight; processingBlock += 1) {
// eslint-disable-next-line no-await-in-loop
            const block = await this.blockchain.getBlockByHeight(processingBlock);

            const blockNumber = this.blockchain.getBlockNumber(block);
            const blockTime = this.blockchain.getBlockTimestamp(block);

            if ((publishedBlockHeight - blockNumber) < this.minConfirmation) {
                logger.info(`${this.jobTitle}: skipping block, because it has less confirmations than expected`, {
                    skippingBlock: blockNumber,
                    minConfirmations: this.minConfirmation,
                });

                break;
            }

            logger.info(`${this.jobTitle}: processing block`, {
                block: processingBlock,
            });

// eslint-disable-next-line no-await-in-loop
            await this.processBlock(block);

            logger.info(`${this.jobTitle}: updating job`, {
                processedBlockHeight: blockNumber,
                processedBlockTime: blockTime,
            });

            this.dao.jobs.updateJob(this.jobId, {
                processedBlockHeight: blockNumber,
                processedBlockTime: blockTime,
            });
        }
    }

// eslint-disable-next-line no-unused-vars,class-methods-use-this
    processBlock(block) {
        throw new MultivestError('processBlock is abstract method');
    }
}

module.exports = AbstractBlockchainListener;
