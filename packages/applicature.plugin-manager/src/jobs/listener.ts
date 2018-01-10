import * as logger from 'winston';
import * as Agenda from 'agenda';
import { BigNumber } from 'bignumber.js';
import { Job } from './index';
import { PluginManager } from '../plugin.manager';
import { BlockchainService } from '../services/blockchain';
import { Dao, Hashtable } from '../structure';

export abstract class BlockchainListener extends Job {
    public dao: Hashtable<Dao<any>>;

    constructor(
        pluginManager: PluginManager, 
        protected blockchainService: BlockchainService, 
        protected sinceBlock: number, 
        protected minConfirmation = 0
    ) {
        super(pluginManager, pluginManager.getExecutor());

        const jobId = this.getJobId();

        this.jobExecutor.define(jobId, async (job, done) => {
            logger.info(`${jobId}: executing job`);

            try {
                await this.execute();

                done();
            }
            catch (err) {
                logger.error(`${jobId} failed to process blocks`, err);

                done(err);
            }
        });
    }

    async init() {
        this.dao = await this.pluginManager.get('mongodb').getDaos();
    }

    async execute() {
        const jobId = this.getJobId();
        let job = await this.dao.jobs.get({job: jobId});

        if (!job) {
            job = await this.dao.jobs.create({
                job: jobId,
                processedBlockHeight: this.sinceBlock
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

        const publicBlockHeight = await this.blockchainService.getBlockHeight();

        await this.processBlocks(job, processingBlock, publicBlockHeight);
    }

    async processBlocks(job: Job, processSinceBlock: number, publishedBlockHeight: number) {
        const jobId = this.getJobId();
        logger.info(`${jobId}: processing blocks`, {
            processSinceBlock,
            publishedBlockHeight,
        });

        for (let processingBlock = processSinceBlock; processingBlock < publishedBlockHeight; processingBlock += 1) {

            const block = await this.blockchainService.getBlockByHeight(processingBlock);

            const blockNumber = block.height;
            const blockTime = block.time;

            if ((publishedBlockHeight - blockNumber) < this.minConfirmation) {
                logger.info(`${jobId}: skipping block, because it has less confirmations than expected`, {
                    skippingBlock: blockNumber,
                    minConfirmations: this.minConfirmation,
                });

                break;
            }

            logger.info(`${jobId}: processing block`, {
                block: processingBlock,
            });

            await this.processBlock(block);

            logger.info(`${jobId}: updating job`, {
                processedBlockHeight: blockNumber,
                processedBlockTime: blockTime,
            });

            this.dao.jobs.update({ job: jobId }, {
                processedBlockHeight: blockNumber,
                processedBlockTime: blockTime,
            });
        }
    }

    processBlock(block: any) {
    }
}
