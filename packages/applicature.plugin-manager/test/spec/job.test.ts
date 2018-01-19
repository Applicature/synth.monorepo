
import { Job } from '../../src/entities/job';
import { TestJob } from '../mocks/job';
import { PluginManagerMock } from '../mocks/plugin.manager';

describe('job', () => {
    let defineMock: any, job: any;

    beforeEach(() => {
        defineMock = jest.fn();
        job = new TestJob(new PluginManagerMock(defineMock));
        job.execute = jest.fn();
    });


    it('should create job', async () => {
        expect(job.getJobId()).toBe('test.job');
        expect(job.enabled).toBeFalsy();
        expect(defineMock.mock.calls.length).toBe(1);
    });

    it('should execute without an error', async () => {
        const jobCallback = defineMock.mock.calls[0][1];
        expect(typeof jobCallback).toBe("function");

        const doneCallback = jest.fn();

        await jobCallback({}, doneCallback);
        expect(job.execute.mock.calls.length).toBe(1);
        expect(doneCallback.mock.calls.length).toBe(1);
        expect(doneCallback.mock.calls[0][0]).toBeFalsy();
    });

    it('should catch error in execute function', async () => {

        const jobCallback = defineMock.mock.calls[0][1];
        const doneCallback = jest.fn();

        job.execute.mockImplementation(() => {
            throw new Error('test error');
        });
        await jobCallback({}, doneCallback);
        expect(doneCallback.mock.calls.length).toBe(1);
        expect(doneCallback.mock.calls[0][0]).toBeTruthy();
    });
});

