"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const AWS = require("aws-sdk");
class StorageService {
    constructor(config) {
        AWS.config.update({ accessKeyId: config.accessKeyId, secretAccessKey: config.secretAccessKey });
        this.s3 = new AWS.S3();
        this.s3Config = config;
    }
    save(path, data) {
        return new Promise((resolve, reject) => {
            const params = { Bucket: this.s3Config.bucket, Key: path, Body: data };
            this.s3.upload(params, (err, dataRes) => {
                if (err) {
                    reject(err);
                }
                else {
                    return resolve({
                        path: dataRes.Key,
                        location: dataRes.Location,
                        etag: dataRes.ETag,
                        bucket: dataRes.Bucket,
                    });
                }
            });
        });
    }
    upload(file) {
        const randomId = `${parseInt((Math.random() * 1000000).toString(), 10)}/${parseInt((Math.random() * 1000000).toString(), 10)}/${parseInt((Math.random() * 1000000).toString(), 10)}`;
        const path = `${randomId}/${file.originalname}`;
        return this.save(path, file.buffer)
            .then(storage => ({
            provider: "s3",
            key: path,
            location: storage.location,
            etag: storage.etag,
            bucket: storage.bucket,
            title: file.originalname,
            mimetype: file.mimetype,
            size: file.size,
        }));
    }
    remove(file) {
        const self = this;
        return new Promise((resolve, reject) => {
            const params = {
                Bucket: file.bucket,
                Key: file.key,
            };
            self.s3.deleteObject(params, (err, data) => {
                if (err) {
                    reject(err);
                }
                else {
                    resolve(data);
                }
            });
        });
    }
}
exports.default = StorageService;
//# sourceMappingURL=index.js.map