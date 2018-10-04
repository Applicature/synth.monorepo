export enum ConnectionState {
  Connected,
  Connecting,
  Disconnected
}

export interface DynamoScheme {
  _id?: string;
  id: string;
}
