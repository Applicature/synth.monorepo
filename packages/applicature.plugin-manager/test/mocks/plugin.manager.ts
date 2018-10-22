
import {PluginManager} from '../../src/plugin.manager';

export class PluginManagerMock extends PluginManager{
    constructor(private defineFunction: () => void) {
        super();
    }

    public getJobExecutor(): any {
        return { define: this.defineFunction };
    }
    public setJobExecutor() {
        return { define: this.defineFunction };
    }

}
