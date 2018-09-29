# @zubko/queue

## Usage

``` js
import SQS from '@zubko/queue/dist/SQS';

const sqs= new SQS({...sqsOptions})

async ()=>{
  await sqs.queue("queueUrl").send("message",options)
}
```