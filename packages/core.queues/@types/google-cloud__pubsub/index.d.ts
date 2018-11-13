declare module '@google-cloud/pubsub' {
    namespace Pubsub {
        namespace v1 {
            class PublisherClient {
                constructor(config: any);
            }

            class SubscriberClient {
                constructor(config: any);
            }
        }
    }

    export = Pubsub
}