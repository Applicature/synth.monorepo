import { Constructable, Hashtable } from '@applicature/synth.plugin-manager';

export const daoIndexes: Hashtable<any> = {};

export function EnsureIndexes(indexes?: Hashtable<any>) {
    indexes = Object.assign({}, indexes || {}, { id: 1 });

    return (DaoConstructor: Constructable<any>) => {
        const prototype = DaoConstructor.prototype;
        const daoId = prototype.getDaoId();
        const collectionName = prototype.getCollectionName();
        daoIndexes[daoId] = {
            collectionName,
            indexes,
        };
    };
}
