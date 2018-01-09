import * as logger from 'winston';
import * as Agenda from 'agenda';
import { BigNumber } from 'bignumber.js';
import { Job } from './index';
import { PluginManager } from '../plugin.manager';
import { BlockchainService } from '../services/blockchain';

export abstract class AbstractBlockchainListener extends Job {
    public dao: any;

    constructor(
        pluginManager: PluginManager, 
        jobExecutor: Agenda, 
        protected id: string, 
        protected blockchainService: BlockchainService, 
        protected sinceBlock: number, 
        protected minConfirmation = 0
    ) {
        super(pluginManager, jobExecutor);

        const jobId = this.getJobId();

        jobExecutor.define(jobId, async (job, done) => {
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
        let job = await this.dao.jobs.getJob(this.id);

        if (!job) {
            job = await this.dao.jobs.insertJob({
                job: this.id,
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

        const publicBlockHeight = await this.blockchainService.getBlockHeight();

        await this.processBlocks(job, processingBlock, publicBlockHeight);
    }

    async processBlocks(job: Job, processSinceBlock: number, publishedBlockHeight: number) {
        logger.info(`${this.id}: processing blocks`, {
            processSinceBlock,
            publishedBlockHeight,
        });

        for (let processingBlock = processSinceBlock; processingBlock < publishedBlockHeight; processingBlock += 1) {

            const block = await this.blockchainService.getBlockByHeight(processingBlock);

            const blockNumber = this.blockchainService.getBlockNumber(block);
            const blockTime = this.blockchainService.getBlockTimestamp(block);

            if ((publishedBlockHeight - blockNumber) < this.minConfirmation) {
                logger.info(`${this.id}: skipping block, because it has less confirmations than expected`, {
                    skippingBlock: blockNumber,
                    minConfirmations: this.minConfirmation,
                });

                break;
            }

            logger.info(`${this.id}: processing block`, {
                block: processingBlock,
            });

            await this.processBlock(block);

            logger.info(`${this.id}: updating job`, {
                processedBlockHeight: blockNumber,
                processedBlockTime: blockTime,
            });

            this.dao.jobs.updateJob(this.id, {
                processedBlockHeight: blockNumber,
                processedBlockTime: blockTime,
            });
        }
    }

    processBlock(block: any) {
    }
}
