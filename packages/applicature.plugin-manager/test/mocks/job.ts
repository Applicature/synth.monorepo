import { Job } from '../../src/entities/job';

export class TestJob extends Job {
    public getJobId() {
        return 'test.job';
    }

    public init() {
        return Promise.resolve();
    }

    public execute() {
        return Promise.resolve();
    }
}
