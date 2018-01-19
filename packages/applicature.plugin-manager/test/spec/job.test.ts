
import { Job } from '../../src/entities/job';

class EmptyJob extends Job {
    public getJobId() {
        return 'empty.job';
    }

    public init() {
        return Promise.resolve();
    }

    public execute() {
        return Promise.resolve();
    }
} 


it('should create job', async () => {
    const defineMock = jest.fn();
    const jobExecutorMock = { define: defineMock };

    const pluginManagerMock: any = {
        getJobExecutor: () => jobExecutorMock
    };
    const job = new EmptyJob(pluginManagerMock);
    expect(job.getJobId()).toBe('empty.job');
    expect(job.enabled).toBeFalsy();
    expect(defineMock.mock.calls.length).toBe(1);

    const jobCallback = defineMock.mock.calls[0][1];
    expect(typeof jobCallback).toBe("function");

    const doneCallback = jest.fn();
    job.execute = jest.fn();

    await jobCallback({}, doneCallback);
    expect(job.execute.mock.calls.length).toBe(1);
    expect(doneCallback.mock.calls.length).toBe(1);

    doneCallback.mockClear();
    job.execute.mockImplementationOnce(() => {
        throw new Error('test error');
    });
    await jobCallback({}, doneCallback);
    expect(doneCallback.mock.calls.length).toBe(1);


})

