import { PluginManager } from '../plugin.manager';
import * as Agenda from 'agenda';

export abstract class Job {
    public enabled: boolean = false;

    constructor(protected pluginManager: PluginManager, protected jobExecutor: Agenda) {}

    abstract getJobId(): string;
    abstract async init(): Promise<void>;
    abstract async execute(): Promise<void>;
}
