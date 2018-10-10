export interface Message {
    messageId?: string;
    data: any;
}

export interface Queue {
    name?: string;
    uniqueTag: string;
}

export enum QueueServiceType {
    AwsSqs = 'AwsSqs',
    GcPubSub = 'GcPubSub',
}
