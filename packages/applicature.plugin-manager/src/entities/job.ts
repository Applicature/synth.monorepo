import * as Agenda from 'agenda';
import * as logger from 'winston';
import { PluginManager } from '../plugin.manager';

export abstract class Job {
    public enabled: boolean = false;
    public inited: boolean = false;
    protected jobExecutor: Agenda;
    protected job: Agenda.Job;

    constructor(protected pluginManager: PluginManager) {
        this.jobExecutor = this.pluginManager.getJobExecutor();
        this.jobExecutor.define(this.getJobId(), async (job, done) => {
            this.job = job;
            logger.info(`${this.getJobId()}: executing job`);

            if (! this.inited) {
                logger.warn(`${this.getJobId()}: was not initialized, initializing`);

                await this.init();

                this.inited = true;

                logger.warn(`${this.getJobId()}: was finally initialized`);
            }

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
    public abstract async execute(): Promise<void>;

    public async init(): Promise<void> {
        this.inited = true;
    }

    public async touch(): Promise<any> {
        return new Promise((resolve, reject) => {
            this.job.touch((err) => {
                if (err) {
                    reject(err);
                } else {
                    resolve();
                }
            });
        });
    }
}
