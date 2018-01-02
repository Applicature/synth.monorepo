import { Job } from './jobs';
import { Hashtable } from './structure';
import { ICOServise } from './services/ico';
import { ExchangeServise } from './services/exchange';

export abstract class Plugin {
    public path: string;

    constructor(private ICOService: ICOServise, private exchangeService: ExchangeServise, private id: number = null) {}

    abstract init(): void; 

    abstract getJobs(): Hashtable<Job>;

    abstract getDao(): any;
}