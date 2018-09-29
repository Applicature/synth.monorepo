import AbstractQueue, { QueueOptions } from "./Abstract";
import { SQS } from 'aws-sdk'
export default class QueueSQS implements AbstractQueue {
  sqs: SQS
  constructor(readonly options: SQS.ClientConfiguration) {
    this.sqs = new SQS(options);
  }
  queue(queueName: string) {
    return {
      send: (message: string, options: any) => this.send(message, {
        ...options,
        queueUrl: queueName
      })
    }
  }
  send(message: string, options?: any) {
    return new Promise((resolve, reject) => {
      this.sqs.sendMessage({
        ...options
      }, (err, data) => {
        if (err) reject(err)
        resolve(data)
      })
    })
  }
}
