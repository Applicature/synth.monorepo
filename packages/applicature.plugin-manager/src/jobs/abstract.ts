import { PluginManager } from '../plugin.manager';
import * as Agenda from 'agenda';

export class Job {
    public enabled: boolean = false;

    constructor(protected pluginManager: PluginManager, protected jobExecutor: Agenda, protected id: string) {}

    async init() {

    }

    async execute() {
        
    }
}
