import { GlobalConfigInstance } from "aws-sdk/lib/config";
import { S3 } from "aws-sdk";
export declare type StorageConfig = GlobalConfigInstance & {
    bucket: string;
};
export interface SaveReturn {
    path: string;
    location: string;
    etag: string;
    bucket: string;
}
export default class StorageService {
    s3: S3;
    s3Config: StorageConfig;
    constructor(config: StorageConfig);
    save(path: string, data: string): Promise<SaveReturn>;
    upload(file: any): Promise<{
        provider: string;
        key: string;
        location: string;
        etag: string;
        bucket: string;
        title: any;
        mimetype: any;
        size: any;
    }>;
    remove(file: any): Promise<{}>;
}
