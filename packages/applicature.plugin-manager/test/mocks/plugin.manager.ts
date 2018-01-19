

export class PluginManagerMock {

    constructor(private defineFunction: Function) {}

    public getJobExecutor() {
        return { define: this.defineFunction };
    }
}
