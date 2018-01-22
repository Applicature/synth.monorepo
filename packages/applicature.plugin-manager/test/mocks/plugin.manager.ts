
export class PluginManagerMock {

    constructor(private defineFunction: () => void) {}

    public getJobExecutor() {
        return { define: this.defineFunction };
    }
}
