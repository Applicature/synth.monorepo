import { PluginManager } from '../plugin.manager';
import * as Agenda from 'agenda';

export abstract class Job {
    constructor(protected pluginManager: PluginManager, protected jobExecutor: Agenda, protected id: string) {}

    abstract async init(): Promise<void>;

    abstract async execute(): Promise<void>;
}
