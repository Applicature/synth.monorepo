export interface QueueOptions {
  [index: string]: any
}
export interface MessageOptions {
  [index: string]: any
}



export default abstract class AbstractQueue {
  constructor(readonly options: QueueOptions) {

  }
  abstract async send(message: any, options?: MessageOptions): Promise<any>
  abstract queue(queueName: string): {
    send: (message: string, options: any) => Promise<any>;
  }
  // abstract consume(options: string, handler: (data: any, metadata: any) => void): void
}