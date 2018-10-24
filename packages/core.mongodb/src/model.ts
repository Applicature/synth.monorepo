export enum ConnectionState {
    Connected = 1,
    Connecting = 2,
    Disconnected = 3,
}

export interface MongoScheme {
    _id?: string;
    id: string;
}
