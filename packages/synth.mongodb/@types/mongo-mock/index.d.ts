declare module 'mongo-mock' {
    import { Db } from 'mongodb';
    
    export class MongoClient {
        public static connect(url: string, opts: any): Promise<Db>;
    }
}