/* eslint-disable class-methods-use-this */
class AbstractJob {
    constructor(jobExecutor, jobId, jobTitle) {
        this.jobExecutor = jobExecutor;
        this.jobId = jobId;
        this.jobTitle = jobTitle;
    }

    execute() {}
}

module.exports = AbstractJob;
