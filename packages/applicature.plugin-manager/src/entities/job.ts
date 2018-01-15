import * as Agenda from 'agenda';
import * as logger from 'winston';
import { PluginManager } from '../plugin.manager';

export abstract class Job {
    public enabled: boolean = false;
    protected jobExecutor: Agenda;
    protected job: Agenda.Job;

    constructor(protected pluginManager: PluginManager) {
        this.jobExecutor = this.pluginManager.getJobExecutor();
        this.jobExecutor.define(this.getJobId(), async (job, done) => {
            this.job = job;
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

    public abstract getJobId(): string;
    public abstract async init(): Promise<void>;
    public abstract async execute(): Promise<void>;
}
