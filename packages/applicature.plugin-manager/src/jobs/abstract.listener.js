const logger = require('winston');

const AbstractJob = require('./abstract.job');
const MultivestError = require('../error');

class AbstractBlockchainListener extends AbstractJob {
    constructor(jobExecutor, jobId, jobTitle, blockchainService, sinceBlock, minConfirmations = 0) {
        super(jobExecutor, jobId, jobTitle);

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

    async execute() {
        let job = await this.jobDao.getJob(this.getJobId());

        if (!job) {
            job = await this.jobDao.insertJob({
                job: this.jobId,
                processedBlockHeight: this.sinceBlock,
            });
        }

        const processedBlockHeight = job.processedBlockHeight;
        const processingBlock = processedBlockHeight + 1;
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

            if ((publishedBlockHeight - block.number) < this.minConfirmation) {
                logger.info(`${this.jobTitle}: skipping block, because it has less confirmations than expected`, {
                    skippingBlock: block.height,
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
                processedBlockHeight: block.number,
                processedBlockTime: block.timestamp,
            });

            this.database.updateJob(this.jobId, {
                processedBlockHeight: block.number,
                processedBlockTime: block.timestamp,
            });
        }
    }

// eslint-disable-next-line no-unused-vars,class-methods-use-this
    processBlock(block) {
        throw new MultivestError('processBlock is abstract method');
    }
}

module.exports = AbstractBlockchainListener;
