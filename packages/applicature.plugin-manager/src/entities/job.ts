import * as logger from 'winston';
import * as Agenda from 'agenda';
import { PluginManager } from '../plugin.manager';

export abstract class Job {
    protected jobExecutor: Agenda;
    public enabled: boolean = false;

    constructor(protected pluginManager: PluginManager) {
        this.jobExecutor = this.pluginManager.getJobExecutor();
        this.jobExecutor.define(this.getJobId(), async (job, done) => {
            logger.info(`${this.getJobId()}: executing job`);

            try {
                await this.execute();
                logger.info(`Job '${this.getJobId()}' executed`);
                done();
            }
            catch (err) {
                logger.error(`Job '${this.getJobId()}' of type ${this.constructor.name} failed to execute`, err);
                done(err);
            }
        });
    }

    abstract getJobId(): string;
    abstract async init(): Promise<void>;
    abstract async execute(): Promise<void>;
}
