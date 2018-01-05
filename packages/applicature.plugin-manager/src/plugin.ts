import { Job } from './jobs';
import { Constructable, Dao, Hashtable } from './structure';
import { PluginManager } from './plugin.manager';

export class Plugin<CompositeDao extends Constructable<Dao<CompositeDao>>> {
    protected daoClasses: Array<typeof Dao>;
    protected dao: Hashtable<Dao<CompositeDao>>;
    public path: string;

    constructor(protected pluginManager: PluginManager, public id: string = null) {}

    init(): void {
        for (const DaoClass of this.daoClasses) {
            const DaoConstructor = DaoClass as CompositeDao;
            const dao = new DaoConstructor();
        }
        
    } 

    getJobs(): Hashtable<typeof Job> {
        return {};
    };

    registerDao(daoClass: typeof Dao) {
        this.daoClasses.push(daoClass);
    }

    getDao(): Hashtable<Dao<any>> {
        return this.dao;
    }
}