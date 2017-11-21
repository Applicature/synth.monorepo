/* eslint-disable class-methods-use-this */
class AbstractJob {
    constructor(jobExecutor, jobId, jobTitle) {
        this.jobExecutor = jobExecutor;
        this.jobId = jobId;
        this.jobTitle = jobTitle;
    }

    async init() {
        return Promise.resolve();
    }

    async execute() {
        return Promise.resolve();
    }
}

module.exports = AbstractJob;
