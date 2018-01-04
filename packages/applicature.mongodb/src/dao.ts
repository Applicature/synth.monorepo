import { Collection, Db, WriteOpResult } from 'mongodb';


export class MongoDBDao<T> {
    private db: Db;
    protected collection: Collection<T>;

    constructor(db: Db) {
        this.db = db;
        this.collection = this.db.collection<T>(this.getCollectionName());
    }

    getDaoId(): string {
        return '';
    }

    getCollectionName(): string {
        return '';
    }

    get(id: number): Promise<T> {
        return this.collection.findOne({ _id: id });
    }

    remove(id: number): Promise<WriteOpResult> {
        return this.collection.remove({ _id: id });
    }
}
