class AbstractDAO {
    constructor(mongodb, collectionName) {
        this.db = mongodb;

        this.collection = this.db.collection(collectionName);
    }

    get(id) {
        return this.collection.findOne({ _id: id });
    }

    remove(id) {
        return this.collection.removeOne({ _id: id });
    }
}

module.exports = AbstractDAO;
